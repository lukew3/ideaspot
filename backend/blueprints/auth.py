from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from ..db import db
from ..tools import serialize
import datetime
import smtplib

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()


blocked_usernames = ['myIdeas','idea','login','register','newIdea','editIdea','trash','settings','<Deleted>']
@auth_bp.route('/register', methods=['POST'])
def register():
	data = request.get_json(silent=True)
	username = data.get('username')
	if username in blocked_usernames:
			return "<p>Invalid username</p>"
	password = data.get('password')
	hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')
	new_user = {"email": data.get('email'),
				"username": username,
				"password": hashed_pwd }
	db.user.insert_one(new_user)
	access_token = create_access_token(identity=username)
	refresh_token = create_refresh_token(identity=username)
	return jsonify(access_token=access_token, refresh_token=refresh_token,username=username)

@auth_bp.route('/login', methods=['POST'])
def login():
	data = request.get_json(silent=True)
	username = data.get('username')
	user = serialize(db.user.find_one({"username": username}))
	if user == None:
		user = serialize(db.user.find_one({"email": username}))
	if user and bcrypt.check_password_hash(user["password"], data.get('password')):
		access_token = create_access_token(identity=user["username"])
		refresh_token = create_refresh_token(identity=user["username"])
		return jsonify(success=True, access_token=access_token, refresh_token=refresh_token,username=user["username"])
	else:
		return jsonify({"message": "Incorrect username/email or password"})

@auth_bp.route('/request_password_reset', methods=['POST'])
def request_password_reset():
	data = request.get_json(silent=True)
	email = data.get('email')
	#create a short-lived jwt and send it as a parameter in an email link
	user = db.user.find_one({"email": email})
	if not (user):
		return jsonify({"msg": "No account with the provided email"}), 422
	access_token = create_access_token(identity=user["username"])
	body = f"Click the following link to reset your password: \nhttps://ideaspot.org/passwordReset/{access_token}"
	send_email(email, "Password reset", body)
	return jsonify(message="Email sent")

def send_email(recipient, subject, body):
	GMAIL_USER = "buildmyidea.tk@gmail.com"
	GMAIL_PASSWORD = "bbfpmkgnqabocyzm"
	email_server = smtplib.SMTP('smtp.gmail.com', 587)
	email_server.ehlo()
	email_server.starttls()
	email_server.login(GMAIL_USER, GMAIL_PASSWORD)
	email_text = "From: %s\nTo: %s\nSubject: %s\n\n%s" % (GMAIL_USER, recipient, subject, body)
	email_server.sendmail(GMAIL_USER, recipient, email_text)
	email_server.close()

@auth_bp.route('/password_reset', methods=['POST'])
@jwt_required()
def password_reset():
	data = request.get_json(silent=True)
	pwd_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
	identity = get_jwt_identity()
	db.user.update_one({"username": identity}, {'$set': {"password": pwd_hash} })
	access_token = create_access_token(identity=identity)
	refresh_token = create_refresh_token(identity=identity)
	return jsonify(access_token=access_token, refresh_token=refresh_token,username=identity)

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
	identity = get_jwt_identity()
	access_token = create_access_token(identity=identity)
	return jsonify(access_token=access_token)

from flask import Flask, Blueprint, flash, request, redirect, url_for, render_template, send_from_directory, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from bson.objectid import ObjectId
from bson import json_util
import datetime
import json
import smtplib


with open('config.json') as config_file:
		config = json.load(config_file)

client = MongoClient()
db = client.buildmyidea
cors = CORS()
bcrypt = Bcrypt()

#initialize flask app
#app = Flask(__name__)
app = Flask(__name__, static_folder='./build', static_url_path='/')
api = Blueprint('api', __name__)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')

#initialize jwt
app.config["JWT_SECRET_KEY"] = config.get('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(weeks=26)
jwt = JWTManager(app)

#initialize cors
cors.init_app(app)

def serialize(dct):
	#turns object id fields to strings
	for k in dct:
		if isinstance(dct[k], ObjectId):
			dct[k] = str(dct[k])
	return dct

def format_ldl(idea, username, ldl):
	#ldl stands for like-dislike
	#ldl is either "like" or "dislike"
	try:
		idea[ldl + "Count"] = len(idea[ldl + "s"])
		if username in idea[ldl + "s"]:
			idea[ldl + "d"] = True
		else:
			idea[ldl + "d"] = False
		idea.pop(ldl + "s")
	except Exception as e:
		idea[ldl + "Count"] = 0
		idea[ldl + "d"] = False
	return idea

def format_idea(idea, username, revNum=-1):
	#formats the idea before it is sent
	idea = serialize(idea)
	idea = format_ldl(idea, username, "like")
	idea = format_ldl(idea, username, "dislike")

	idea["revisionTime"] = idea["revisions"][revNum]["time"]
	idea["title"] = idea["revisions"][revNum]["title"]
	idea["description"] = idea["revisions"][revNum]["description"]
	idea["revisionTimes"] = []
	for revision in idea["revisions"]:
		idea["revisionTimes"].append(revision["time"])
	return idea

@app.route('/')
def index():
	return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
  return app.send_static_file('index.html')

blocked_usernames = ['myIdeas','idea','login','register','newIdea','editIdea']
@api.route('/register', methods=['POST'])
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

@api.route('/login', methods=['POST'])
def login():
	data = request.get_json(silent=True)
	username = data.get('username')
	user = serialize(db.user.find_one({"username": username}))
	if user == None:
		user = serialize(db.user.find_one({"email": username}))
	if user and bcrypt.check_password_hash(user["password"], data.get('password')):
		access_token = create_access_token(identity=user["username"])
		refresh_token = create_refresh_token(identity=user["username"])
		return jsonify(access_token=access_token, refresh_token=refresh_token,username=user["username"])
	else:
		return jsonify({"msg": "Bad username or password"}), 422

@api.route('/request_password_reset', methods=['POST'])
def request_password_reset():
	data = request.get_json(silent=True)
	email = data.get('email')
	#create a short-lived jwt and send it as a parameter in an email link
	user = db.user.find_one({"email": email})
	if not (user):
		return jsonify({"msg": "No account with the provided email"}), 422
	access_token = create_access_token(identity=user["username"])
	body = f"Click the following link to reset your password: \nhttps://buildmyidea.tk/passwordReset/{access_token}"
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

@api.route('/password_reset', methods=['POST'])
@jwt_required()
def password_reset():
	data = request.get_json(silent=True)
	pwd_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
	identity = get_jwt_identity()
	db.user.update_one({"username": identity}, {'$set': {"password": pwd_hash} })
	access_token = create_access_token(identity=identity)
	refresh_token = create_refresh_token(identity=identity)
	return jsonify(access_token=access_token, refresh_token=refresh_token,username=identity)

@api.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
	identity = get_jwt_identity()
	access_token = create_access_token(identity=identity)
	return jsonify(access_token=access_token)

@api.route('/create_idea', methods=['POST'])
@jwt_required()
def create_idea():
	data = request.get_json(silent=True)
	new_idea = {"revisions": [{
					"time": datetime.datetime.now(),
					"title": data.get('title'),
					"description": data.get('description'),
				}],
				"creator": get_jwt_identity(),
				"private": data.get('private') }
	new_id = str(db.idea.insert_one(new_idea).inserted_id)
	return jsonify(id=new_id)


@api.route('/edit_idea/<ideaId>', methods=['PATCH'])
@jwt_required()
def edit_idea(ideaId):
	data = request.get_json(silent=True)
	current_user = get_jwt_identity()
	old_idea = db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user})
	revision = {
		"time": datetime.datetime.now(),
		"title": data.get('title'),
		"description": data.get('description')
	}
	data.pop('title')
	data.pop('description')
	db.idea.update_one(old_idea, {'$set': data})
	db.idea.update_one(old_idea, {'$push': {"revisions": revision}})
	new_idea = format_idea(db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user}), current_user)
	return new_idea

@api.route('/trash_idea/<ideaId>', methods=['POST'])
@jwt_required()
def recycle_idea(ideaId):
	#Set idea deletion date for 30 days in the future
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { "$set": {"delete_date": datetime.datetime.now() + datetime.timedelta(30)}})
	return jsonify(status="idea recycled")

@api.route('/delete_idea/<ideaId>', methods=['DELETE'])
@jwt_required()
def delete_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.delete_one({"_id": ObjectId(ideaId), "creator": current_user})
	return jsonify(status="idea deleted")

@api.route('/restore_idea/<ideaId>', methods=['POST'])
@jwt_required()
def restore_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { '$unset': { "delete_date": '' } })
	return jsonify(status="idea restored")

@api.route('/get_ideas', methods=['GET'])
@jwt_required(optional=True)
def get_ideas():
	ideascur = db.idea.find({"private": False, "delete_date": { "$exists": False} })
	ideas = [format_idea(item, get_jwt_identity()) for item in ideascur]
	ideas.reverse()
	return jsonify({'ideas': ideas})


@api.route('/get_my_ideas', methods=['GET'])
@jwt_required()
def get_my_ideas():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user})
	ideas = [format_idea(item, current_user) for item in ideascur]
	ideas.reverse()
	return jsonify({'ideas': ideas})

@api.route('/get_trash', methods=['GET'])
@jwt_required()
def get_trash():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": True }})
	ideas = [format_idea(item, current_user) for item in ideascur]
	return jsonify({'ideas': ideas})

@api.route('/get_idea/<ideaId>', defaults={'revNum': -1}, methods=['GET'])
@api.route('/get_idea/<ideaId>/<revNum>', methods=['GET'])
@jwt_required(optional=True)
def get_idea(ideaId, revNum):
	revNum = int(revNum)
	idea_obj = format_idea(db.idea.find_one({"_id": ObjectId(ideaId)}), get_jwt_identity(), revNum=revNum)
	if idea_obj["private"] == True and idea_obj["creator"] != get_jwt_identity():
		return "<h1>This idea is private, you must sign in as owner to access</h1>"
	else:
		return jsonify(idea=idea_obj)

@api.route('/get_user/<username>', methods=['GET'])
@jwt_required(optional=True)
def get_user(username):
	user = serialize(db.user.find_one({"username": username}))
	user.pop("password")
	user.pop("email")
	current_user = get_jwt_identity()
	if current_user == username:
			ideascur = db.idea.find({"creator": current_user})
	else:
			ideascur = db.idea.find({"creator": username, "private": False})
	user["ideas"] = [format_idea(item, username) for item in ideascur]
	user["ideas"].reverse()
	user["ideasCount"] = len(user["ideas"])
	return jsonify(user)

@api.route('/add_comment', methods=['POST'])
@jwt_required()
def add_comment():
    data = request.get_json(silent=True)
    idea_id = data.get('ideaId')
    comment_content = (data.get('commentContent')).strip()
    if comment_content == '':
        return jsonify(status="Empty comment; invalid"), 422
    db.idea.update_one({"_id": ObjectId(idea_id)},
                       {'$push': {'comments': {'user': get_jwt_identity(), 'comment': comment_content}}})
    return jsonify(user=get_jwt_identity(), comment=comment_content, status='Comment added successfully')

@api.route('/like_idea', methods=['POST'])
@jwt_required()
def like_idea():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'dislikes': get_jwt_identity() }})
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$addToSet': {'likes': get_jwt_identity() }})
	return jsonify(status="liked successfully")

@api.route('/remove_idea_like', methods=['POST'])
@jwt_required()
def remove_idea_like():
	idea_id = request.get_json(silent=True).get('ideaId')
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'likes': get_jwt_identity() }})
	return jsonify(status="like removed successfully")

@api.route('/dislike_idea', methods=['POST'])
@jwt_required()
def dislike_idea():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	#remove from likes list if found and add to dislikes list
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'likes': get_jwt_identity() }})
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$addToSet': {'dislikes': get_jwt_identity() }})
	return jsonify(status="disliked successfully")

@api.route('/remove_idea_dislike', methods=['POST'])
@jwt_required()
def remove_idea_dislike():
	idea_id = request.get_json(silent=True).get('ideaId')
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'dislikes': get_jwt_identity() }})
	return jsonify(status="dislike removed successfully")

app.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	app.run(port=5001, debug=True)

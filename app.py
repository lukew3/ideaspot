from flask import Flask, Blueprint, flash, request, redirect, url_for, render_template, send_from_directory, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from bson.objectid import ObjectId
from bson import json_util
import json

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

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
  return app.send_static_file('index.html')

@api.route('/register', methods=['POST'])
def register():
	blocked_usernames = ['myIdeas','idea','login','register','newIdea','editIdea']
	data = request.get_json(silent=True)
	email = data.get('email')
	username = data.get('username')
	if username in blocked_usernames:
		return "<p>Invalid username</p>"
	password = data.get('password')
	hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')
	new_user = {"email": email,
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
    password = data.get('password')
    user = serialize(db.user.find_one({"username": username}))
    if user == None:
        user = serialize(db.user.find_one({"email": username}))
    if user and bcrypt.check_password_hash(user["password"], password):
        access_token = create_access_token(identity=user["username"])
        refresh_token = create_refresh_token(identity=user["username"])
        return jsonify(access_token=access_token, refresh_token=refresh_token,username=user["username"])
    else:
        return jsonify({"msg": "Bad username or password"}), 401

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
	title = data.get('title')
	details = data.get('details')
	forSale = data.get('forSale')
	private = data.get('private')
	current_user = get_jwt_identity()
	new_idea = {"title": title,
				"details": details,
				"forSale": forSale,
				"creator": current_user,
				"private": private }
	new_id = str(db.idea.insert_one(new_idea).inserted_id)
	return jsonify(id=new_id)


@api.route('/edit_idea/<ideaId>', methods=['PATCH'])
@jwt_required()
def edit_idea(ideaId):
	data = request.get_json(silent=True)
	current_user = get_jwt_identity()
	old_idea = db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user})
	db.idea.update_one(old_idea, {'$set': data})
	new_idea = serialize(db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user}))
	return new_idea


@api.route('/delete_idea/<ideaId>', methods=['DELETE'])
@jwt_required()
def delete_idea(ideaId):
	data = request.get_json(silent=True)
	current_user = get_jwt_identity()
	db.idea.delete_one({"_id": ObjectId(ideaId), "creator": current_user})
	return jsonify(status="idea deleted")


@api.route('/get_ideas', methods=['GET'])
def get_ideas():
    ideascur = db.idea.find({"private": False})
    ideas = [serialize(item) for item in ideascur]
    ideas.reverse()
    return jsonify({'ideas': ideas})


@api.route('/get_my_ideas', methods=['GET'])
@jwt_required()
def get_my_ideas():
    current_user = get_jwt_identity()
    ideascur = db.idea.find({"creator": current_user})
    ideas = [serialize(item) for item in ideascur]
    ideas.reverse()
    return jsonify({'ideas': ideas})

@api.route('/get_idea/<ideaId>', methods=['GET'])
@jwt_required(optional=True)
def get_idea(ideaId):
	idea_obj = serialize(db.idea.find_one({"_id": ObjectId(ideaId)}))
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
	user["ideas"] = [serialize(item) for item in ideascur]
	user["ideas"].reverse()
	user["ideasCount"] = len(user["ideas"])
	return jsonify(user)


app.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
    app.run(port=5001, debug=True)

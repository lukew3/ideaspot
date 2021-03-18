from flask import Flask, Blueprint, flash, request, redirect, url_for, render_template, send_from_directory, jsonify, Response
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
import json

with open('config.json') as config_file:
	config = json.load(config_file)

db = MongoEngine()
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
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

#initialize database connection
app.config['MONGODB_SETTINGS'] = {
    "db": config.get('MONGODB_DB', 'buildmyidea'),
    "host": config.get('MONGODB_HOST', 'localhost'),
    "port": config.get("MONGODB_PORT", 27017)
}
db.init_app(app)

#initialize cors
cors.init_app(app)

class Idea(db.Document):
    title = db.StringField()
    details = db.StringField()
    forSale = db.BooleanField()
    private = db.BooleanField()
    creator = db.StringField()

    def to_json(self):
        return {"_id": str(self.pk),
                "title": self.title,
                "details": self.details,
                "forSale": self.forSale,
				"private": self.private,
				"creator": self.creator}


class User(db.Document):
    email = db.StringField(required=True, unique=True)
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)
    #is_active = db.BooleanField(default=True)

    def to_json(self):
        return {"_id": str(self.pk),
                "email": self.email,
                "username": self.username,
                "password": self.password}

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
	new_user = User(email=email, username=username, password=hashed_pwd).save()
	access_token = create_access_token(identity=username)
	refresh_token = create_refresh_token(identity="example_user")
	return jsonify(access_token=access_token, refresh_token=refresh_token,username=username)

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    username = data.get('username')
    password = data.get('password')
    user = User.objects(username=username).first()
    if user == None:
        user = User.objects(email=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.username)
        refresh_token = create_refresh_token(identity="example_user")
        return jsonify(access_token=access_token, refresh_token=refresh_token,username=user.username)
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
	new_idea = Idea(title=title, details=details, forSale=forSale, creator=current_user, private=private).save()
	return new_idea.to_json()


@api.route('/edit_idea/<ideaId>', methods=['PATCH'])
@jwt_required()
def edit_idea(ideaId):
	data = request.get_json(silent=True)
	current_user = get_jwt_identity()
	old_idea = Idea.objects(id=ideaId, creator=current_user).first()
	old_idea.update(**data)
	new_idea = Idea.objects(id=ideaId, creator=current_user).first()
	return new_idea.to_json()


@api.route('/delete_idea/<ideaId>', methods=['DELETE'])
@jwt_required()
def delete_idea(ideaId):
	data = request.get_json(silent=True)
	current_user = get_jwt_identity()
	idea = Idea.objects(id=ideaId, creator=current_user).first()
	idea.delete()
	print("deleted")
	return jsonify(status="idea deleted")


@api.route('/get_ideas', methods=['GET'])
def get_ideas():
    json_ideas = {}
    json_ideas['ideas'] = []
    ideas = (Idea.objects(private=False).all())
    ideas = reversed(ideas)
    for idea in ideas:
        idea = idea.to_json()
        json_ideas['ideas'].append(idea)
    return json_ideas


@api.route('/get_my_ideas', methods=['GET'])
@jwt_required()
def get_my_ideas():
    json_ideas = {}
    json_ideas['ideas'] = []
    current_user = get_jwt_identity()
    ideas = (Idea.objects(creator=current_user).all())
    ideas = reversed(ideas)
    for idea in ideas:
        idea = idea.to_json()
        json_ideas['ideas'].append(idea)
    return json_ideas

@api.route('/get_idea/<ideaId>', methods=['GET'])
@jwt_required(optional=True)
def get_idea(ideaId):
	idea_obj = Idea.objects(id=ideaId).first()
	if idea_obj.private == True and idea_obj.creator != get_jwt_identity():
		return "<h1>This idea is private, you must sign in as owner to access</h1>"
	else:
		idea = idea_obj.to_json()
		return jsonify(idea=idea)


app.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
    app.run(port=5001, debug=True)

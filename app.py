from flask import Flask, flash, request, redirect, url_for, render_template, send_from_directory, jsonify, Response
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
import json

with open('/etc/config.json') as config_file:
	config = json.load(config_file)

db = MongoEngine()
cors = CORS()
bcrypt = Bcrypt()

#initialize flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')

#initialize jwt
app.config["JWT_SECRET_KEY"] = config.get('JWT_SECRET_KEY')
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


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, username=username, password=hashed_pwd).save()
    return new_user.to_json()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    username = data.get('username')
    password = data.get('password')
    user = User.objects(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify(token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401

"""
@app.route('/api/refresh', methods=['POST'])
def refresh():
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200
"""

@app.route('/api/create_idea', methods=['POST'])
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


@app.route('/api/get_ideas', methods=['GET'])
def get_ideas():
    json_ideas = {}
    json_ideas['ideas'] = []
    ideas = (Idea.objects(private=False).all())
    ideas = reversed(ideas)
    for idea in ideas:
        idea = idea.to_json()
        json_ideas['ideas'].append(idea)
    return json_ideas

@app.route('/api/get_my_ideas', methods=['GET'])
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

@app.route('/api/get_idea/<ideaId>', methods=['GET'])
def get_idea(ideaId):
    idea = (Idea.objects(id=ideaId).first()).to_json()
    return jsonify(idea=idea)


if __name__ == "__main__":
    app.run(debug=True)

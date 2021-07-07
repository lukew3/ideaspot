from flask import Flask, Blueprint, flash, request, redirect, url_for, render_template, send_from_directory, jsonify, Response
from flask_cors import CORS
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
import datetime
import json
from backend import auth, comments, misc, voting

with open('config.json') as config_file:
		config = json.load(config_file)

cors = CORS()

#initialize flask app
#app = Flask(__name__)
app = Flask(__name__, static_folder='./build', static_url_path='/')
api = Blueprint('api', __name__)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')

#initialize jwt
app.config["JWT_SECRET_KEY"] = config.get('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(weeks=26)
jwt = JWTManager(app)

#initialize cors
cors.init_app(app)


@app.route('/')
def index():
	return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
  return app.send_static_file('index.html')

api.register_blueprint(auth)
api.register_blueprint(comments)
api.register_blueprint(misc)
api.register_blueprint(voting)

app.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	app.run(port=5001, debug=True)

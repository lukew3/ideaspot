from flask import Flask, Blueprint, flash, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
import datetime, json
from ideaspot.blueprints import auth_bp, comments_bp, idea_bp, list_bp, user_bp, voting_bp

with open('config.json') as config_file:
		config = json.load(config_file)

cors = CORS()

app = Flask(__name__, static_folder='../build', static_url_path='/')
api_bp = Blueprint('api', __name__)
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

api_bp.register_blueprint(auth_bp)
api_bp.register_blueprint(comments_bp)
api_bp.register_blueprint(idea_bp)
api_bp.register_blueprint(list_bp)
api_bp.register_blueprint(user_bp)
api_bp.register_blueprint(voting_bp)

app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == "__main__":
	app.run(port=5001, debug=True)

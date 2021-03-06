from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..db import db
from ..tools import clean_list

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/<username>', methods=['GET'])
@jwt_required(optional=True)
def get_user(username):
	user = db.user.find_one({"username": username})
	user['_id'] = str(user['_id'])
	user.pop("password")
	user.pop("email")
	if "builds" in user:
		user.pop("builds")
	current_user = get_jwt_identity()
	if current_user == username:
			ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": False }})
	else:
			ideascur = db.idea.find({"creator": username, "private": False, "delete_date": { "$exists": False }})
	user["ideas"] = clean_list(ideascur, username)
	user["ideas"].reverse()
	return jsonify(user)

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import serialize, clean_list
import datetime

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/<username>', methods=['GET'])
@jwt_required(optional=True)
def get_user(username):
	user = serialize(db.user.find_one({"username": username}))
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

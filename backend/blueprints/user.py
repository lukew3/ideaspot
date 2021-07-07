from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import serialize, format_ldl, serialize_comment_thread, format_idea
import datetime

user_bp = Blueprint('misc', __name__)

@user_bp.route('/get_user/<username>', methods=['GET'])
@jwt_required(optional=True)
def get_user(username):
	user = serialize(db.user.find_one({"username": username}))
	user.pop("password")
	user.pop("email")
	current_user = get_jwt_identity()
	if current_user == username:
			ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": False }})
	else:
			ideascur = db.idea.find({"creator": username, "private": False, "delete_date": { "$exists": False }})
	user["ideas"] = [format_idea(item, username) for item in ideascur]
	user["ideas"].reverse()
	user["ideasCount"] = len(user["ideas"])
	return jsonify(user)

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import serialize, format_ldl, serialize_comment_thread, format_idea
import datetime

list_bp = Blueprint('list', __name__)

@list_bp.route('/get_ideas', methods=['GET'])
@jwt_required(optional=True)
def get_ideas():
	try:
		page = int(request.args['page'])
	except Exception:
		page = 1

	per_page = 10
	offset = (page-1) * per_page

	starting_id = db.idea.find().sort('_id', -1)
	last_id = starting_id[offset]['_id']

	ideascur =  db.idea.find(
		{'_id': {'$lte': last_id}, "private": False, "delete_date": { "$exists": False}}
	).sort('_id', -1).limit(per_page)

	ideas = [format_idea(item, get_jwt_identity()) for item in ideascur]
	return jsonify({'ideas': ideas})

@list_bp.route('/get_my_ideas', methods=['GET'])
@jwt_required()
def get_my_ideas():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": False }})
	ideas = [format_idea(item, current_user) for item in ideascur]
	ideas.reverse()
	return jsonify({'ideas': ideas})

@list_bp.route('/get_trash', methods=['GET'])
@jwt_required()
def get_trash():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": True }})
	ideas = [format_idea(item, current_user) for item in ideascur]
	return jsonify({'ideas': ideas})

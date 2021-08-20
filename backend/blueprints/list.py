from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import clean_list
import datetime
import math

list_bp = Blueprint('list', __name__)

@list_bp.route('/get_ideas', methods=['GET'])
@jwt_required(optional=True)
def get_ideas():
	if 'page' in request.args:
		page = int(request.args['page'])
	else:
		page = 1

	per_page = 10
	offset = (page-1) * per_page

	ideascur =  db.idea.find(
		{"mod_ruling": "accepted", "private": False, "delete_date": { "$exists": False}}
	).sort('created_at', -1).skip(offset).limit(per_page)

	ideas = clean_list(ideascur, get_jwt_identity())
	maxPage = math.ceil(db.idea.count_documents({}) / per_page)
	return jsonify({'ideas': ideas, 'maxPage': maxPage})

@list_bp.route('/get_my_ideas', methods=['GET'])
@jwt_required()
def get_my_ideas():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": False }})
	ideas = clean_list(ideascur, current_user)
	ideas.reverse()
	return jsonify({'ideas': ideas})

@list_bp.route('/get_trash', methods=['GET'])
@jwt_required()
def get_trash():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": True }})
	ideas = clean_list(ideascur, current_user)
	return jsonify({'ideas': ideas})

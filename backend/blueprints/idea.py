from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import serialize, format_ldl, serialize_comment_thread, format_idea
import datetime

idea = Blueprint('idea', __name__)

@idea.route('/create_idea', methods=['POST'])
@jwt_required()
def create_idea():
	data = request.get_json(silent=True)
	new_idea = {"revisions": [{
					"time": datetime.datetime.now(),
					"title": data.get('title'),
					"description": data.get('description'),
				}],
				"creator": get_jwt_identity(),
				"private": data.get('private') }
	new_id = str(db.idea.insert_one(new_idea).inserted_id)
	return jsonify(id=new_id)


@idea.route('/edit_idea/<ideaId>', methods=['PATCH'])
@jwt_required()
def edit_idea(ideaId):
	data = request.get_json(silent=True)
	current_user = get_jwt_identity()
	old_idea = db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user})
	revision = {
		"time": datetime.datetime.now(),
		"title": data.get('title'),
		"description": data.get('description')
	}
	data.pop('title')
	data.pop('description')
	db.idea.update_one(old_idea, {'$set': data})
	db.idea.update_one(old_idea, {'$push': {"revisions": revision}})
	new_idea = format_idea(db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user}), current_user)
	return new_idea

@idea.route('/trash_idea/<ideaId>', methods=['POST'])
@jwt_required()
def recycle_idea(ideaId):
	#Set idea deletion date for 30 days in the future
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { "$set": {"delete_date": datetime.datetime.now() + datetime.timedelta(30)}})
	return jsonify(status="idea recycled")

@idea.route('/delete_idea/<ideaId>', methods=['DELETE'])
@jwt_required()
def delete_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.delete_one({"_id": ObjectId(ideaId), "creator": current_user})
	return jsonify(status="idea deleted")

@idea.route('/restore_idea/<ideaId>', methods=['POST'])
@jwt_required()
def restore_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { '$unset': { "delete_date": '' } })
	return jsonify(status="idea restored")

@idea.route('/get_idea/<ideaId>', defaults={'revNum': -1}, methods=['GET'])
@idea.route('/get_idea/<ideaId>/<revNum>', methods=['GET'])
@jwt_required(optional=True)
def get_idea(ideaId, revNum):
	revNum = int(revNum)
	idea_obj = format_idea(db.idea.find_one({"_id": ObjectId(ideaId)}), get_jwt_identity(), revNum=revNum)
	if idea_obj["private"] == True and idea_obj["creator"] != get_jwt_identity():
		return "<h1>This idea is private, you must sign in as owner to access</h1>", 500
	try:
		if idea_obj["delete_date"] and idea_obj["creator"] != get_jwt_identity():
			return "<h1>This idea has been deleted</h1>", 500
	except Exception as e:
		pass
		#print(e);
	return jsonify(idea=idea_obj)

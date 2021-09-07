from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import format_idea, update_rep
import datetime
import validators

idea_bp = Blueprint('idea', __name__)

@idea_bp.route('/create_idea', methods=['POST'])
@jwt_required()
def create_idea():
	data = request.get_json(silent=True)
	new_idea = {"history": [],
				"title": data.get('title'),
				"description": data.get('description'),
				"mod_ruling": "pending",
				"creator": get_jwt_identity(),
				"private": data.get('private'),
				"created_at": datetime.datetime.now(),
				"last_updated_at": datetime.datetime.now() }
	new_id = str(db.idea.insert_one(new_idea).inserted_id)
	return jsonify(id=new_id)


@idea_bp.route('/edit_idea/<ideaId>', methods=['PATCH'])
@jwt_required()
def edit_idea(ideaId):
	data = request.get_json(silent=True)
	current_user = get_jwt_identity()
	old_idea = db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user})
	# if privacy is the only thing that changed, don't create a duplicate revision
	if (data.get('title') == old_idea['title'] and data.get('description') == old_idea['description']):
		db.idea.update_one(old_idea, {"$set": { 'private': data.get('private') }})
	else:
		revision = {
			"time": old_idea["last_updated_at"],
			"title": old_idea["title"],
			"description": old_idea["description"]
		}
		db.idea.update_one(old_idea, {
			'$push': {"history": revision},
			"$set": {'last_updated_at': datetime.datetime.now(),
				'title': data.get('title'),
				'description': data.get('description'),
				'private': data.get('private')}
		})
	new_idea = format_idea(db.idea.find_one({"_id": ObjectId(ideaId), "creator": current_user}), current_user)
	return new_idea

@idea_bp.route('/trash_idea/<ideaId>', methods=['POST'])
@jwt_required()
def recycle_idea(ideaId):
	#Set idea deletion date for 30 days in the future
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { "$set": {"delete_date": datetime.datetime.now() + datetime.timedelta(30)}})
	return jsonify(status="idea recycled")

@idea_bp.route('/delete_idea/<ideaId>', methods=['DELETE'])
@jwt_required()
def delete_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.delete_one({"_id": ObjectId(ideaId), "creator": current_user})
	return jsonify(status="idea deleted")

@idea_bp.route('/restore_idea/<ideaId>', methods=['POST'])
@jwt_required()
def restore_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { '$unset': { "delete_date": '' } })
	return jsonify(status="idea restored")

@idea_bp.route('/get_idea/<ideaId>', defaults={'revNum': -1}, methods=['GET'])
@idea_bp.route('/get_idea/<ideaId>/<revNum>', methods=['GET'])
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
	return jsonify(idea=idea_obj)


@idea_bp.route('/set_build_status', methods=['POST'])
@jwt_required()
def set_build_status():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	status = data.get('status')
	link = data.get('link')
	if status not in ['built', 'building', 'plan_to_build', 'not_building']:
		return jsonify(status="Status invalid"), 500
	# Remove old build statuses
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$pull': {f"builders.building": get_jwt_identity()}})
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$pull': {f"builders.plan_to_build": get_jwt_identity()}})
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$pull': {f"builders.built": { 'user': get_jwt_identity() }}})
	# Remove old build from user object
	db.user.update_one({"username": get_jwt_identity()}, {'$pull': {f"builds.building": idea_id}})
	db.user.update_one({"username": get_jwt_identity()}, {'$pull': {f"builds.plan_to_build": idea_id}})
	db.user.update_one({"username": get_jwt_identity()}, {'$pull': {f"builds.built": idea_id}})
	if status == 'not_building':
		return jsonify(status='Build removed successfully')
	elif status == 'built':
		if not validators.url(link):
			link = "https://" + link
			if not validators.url(link):
				return jsonify(status="Invalid link")
		# Add build to user object
		# Should objectId of idea or string be stored in array?
		build_obj = {"user": get_jwt_identity(), "link": link}
	else:
		build_obj = get_jwt_identity()
	db.user.update_one({"username": get_jwt_identity()}, {"$push": {f"builds.{status}": idea_id}})
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$push': {f"builders.{status}": build_obj}})
	return jsonify(status="Build added successfully")

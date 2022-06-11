from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson.objectid import ObjectId
from ..db import db
from ..tools import format_idea
import datetime
import validators

idea_bp = Blueprint('idea', __name__)

@idea_bp.route('/create_idea', methods=['POST'])
@jwt_required()
def create_idea():
	data = request.get_json(silent=True)
	if data.get('title') == '':
		return jsonify(status="idea must have a title")
	new_idea = {"history": [],
				"title": data.get('title'),
				"description": data.get('description'),
				"creator": get_jwt_identity(),
				"private": data.get('private'),
				"created_at": datetime.datetime.now(),
				"last_updated_at": datetime.datetime.now(),
				"likeCount": 1,
				"dislikeCount": 0 }
	new_id = str(db.idea.insert_one(new_idea).inserted_id)
	db.vote.insert_one({"username": get_jwt_identity(), "ideaId": new_id, "positive": True})
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


@idea_bp.route('/mod_remove/<ideaId>', methods=['PATCH'])
@jwt_required()
def mod_remove_idea(ideaId):
	current_user = get_jwt_identity()
	if current_user == 'lukew3':
		idea = db.idea.find_one({"_id": ObjectId(ideaId)})
		db.idea.update_one(idea, {"$set": { 'mod_removed': True }})
		return jsonify(status="success")
	else:
		return jsonify(status="not a moderator")


@idea_bp.route('/trash_idea/<ideaId>', methods=['POST'])
@jwt_required()
def recycle_idea(ideaId):
	#Set idea deletion date for 30 days in the future
	current_user = get_jwt_identity()
	# TODO: Ensure the user is the owner of the idea
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
	# TODO: Ensure the user is the owner of the idea
	db.idea.update_one({"_id": ObjectId(ideaId)}, { '$unset': { "delete_date": '' } })
	return jsonify(status="idea restored")


@idea_bp.route('/get_idea/<ideaId>', defaults={'revNum': -1}, methods=['GET'])
@idea_bp.route('/get_idea/<ideaId>/<revNum>', methods=['GET'])
@jwt_required(optional=True)
def get_idea(ideaId, revNum):
	idea_obj = format_idea(db.idea.find_one({"_id": ObjectId(ideaId)}), get_jwt_identity(), revNum=int(revNum))
	if idea_obj["private"] == True and idea_obj["creator"] != get_jwt_identity():
		return jsonify(idea="unauthorized")
	if "delete_date" in idea_obj and idea_obj["creator"] != get_jwt_identity():
		return jsonify(idea="deleted")
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
	# Get idea
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	# Remove old build statuses
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$pull': {f"builders.building": get_jwt_identity()}})
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$pull': {f"builders.plan_to_build": get_jwt_identity()}})
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$pull': {f"builders.built": { 'user': get_jwt_identity() }}})
	# Remove old build from user object
	db.user.update_one({"username": get_jwt_identity()}, {'$pull': {"building": { "_id": idea_id }}})
	db.user.update_one({"username": get_jwt_identity()}, {'$pull': {"plan_to_build": { "_id": idea_id }}})
	db.user.update_one({"username": get_jwt_identity()}, {'$pull': {"built": { "_id": idea_id }}})
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
		user_build_obj = {"_id": idea_id, "title": idea['title'], "build": link}
	else:
		build_obj = get_jwt_identity()
		user_build_obj = {"_id": idea_id, "title": idea['title']}
	db.user.update_one({"username": get_jwt_identity()}, {"$push": {f"{status}": user_build_obj}})
	db.idea.update_one({"_id": ObjectId(idea_id)}, {'$push': {f"builders.{status}": build_obj}})
	return jsonify(status="Build added successfully")

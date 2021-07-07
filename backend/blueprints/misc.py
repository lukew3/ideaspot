from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import serialize, format_ldl, serialize_comment_thread, format_idea
import datetime

misc = Blueprint('misc', __name__)


@misc.route('/create_idea', methods=['POST'])
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


@misc.route('/edit_idea/<ideaId>', methods=['PATCH'])
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

@misc.route('/trash_idea/<ideaId>', methods=['POST'])
@jwt_required()
def recycle_idea(ideaId):
	#Set idea deletion date for 30 days in the future
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { "$set": {"delete_date": datetime.datetime.now() + datetime.timedelta(30)}})
	return jsonify(status="idea recycled")

@misc.route('/delete_idea/<ideaId>', methods=['DELETE'])
@jwt_required()
def delete_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.delete_one({"_id": ObjectId(ideaId), "creator": current_user})
	return jsonify(status="idea deleted")

@misc.route('/restore_idea/<ideaId>', methods=['POST'])
@jwt_required()
def restore_idea(ideaId):
	current_user = get_jwt_identity()
	db.idea.update_one({"_id": ObjectId(ideaId)}, { '$unset': { "delete_date": '' } })
	return jsonify(status="idea restored")

@misc.route('/get_ideas', methods=['GET'])
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

@misc.route('/get_my_ideas', methods=['GET'])
@jwt_required()
def get_my_ideas():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": False }})
	ideas = [format_idea(item, current_user) for item in ideascur]
	ideas.reverse()
	return jsonify({'ideas': ideas})

@misc.route('/get_trash', methods=['GET'])
@jwt_required()
def get_trash():
	current_user = get_jwt_identity()
	ideascur = db.idea.find({"creator": current_user, "delete_date": { "$exists": True }})
	ideas = [format_idea(item, current_user) for item in ideascur]
	return jsonify({'ideas': ideas})

@misc.route('/get_idea/<ideaId>', defaults={'revNum': -1}, methods=['GET'])
@misc.route('/get_idea/<ideaId>/<revNum>', methods=['GET'])
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

@misc.route('/get_user/<username>', methods=['GET'])
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

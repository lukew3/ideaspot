from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import update_idea_creator_rep

voting_bp = Blueprint('voting', __name__)

@voting_bp.route('/like_idea', methods=['POST'])
@jwt_required()
def like_idea():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	if get_jwt_identity() in idea["dislikes"]:
		db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$pull': {'dislikes': get_jwt_identity() }})
		update_idea_creator_rep(idea_id, 1)
	if get_jwt_identity() not in idea["likes"]:
		db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$addToSet': {'likes': get_jwt_identity() }})
		update_idea_creator_rep(idea_id, 1)
	return jsonify(status="liked successfully")

@voting_bp.route('/remove_idea_like', methods=['POST'])
@jwt_required()
def remove_idea_like():
	idea_id = request.get_json(silent=True).get('ideaId')
	if get_jwt_identity() in db.idea.find_one({"_id": ObjectId(idea_id)})["likes"]:
		db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$pull': {'likes': get_jwt_identity() }})
		update_idea_creator_rep(idea_id, -1)
	return jsonify(status="like removed successfully")

@voting_bp.route('/dislike_idea', methods=['POST'])
@jwt_required()
def dislike_idea():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	if get_jwt_identity() in idea["likes"]:
		db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$pull': {'likes': get_jwt_identity() }})
		update_idea_creator_rep(idea_id, -1)
	if get_jwt_identity() not in idea["dislikes"]:
		db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$addToSet': {'dislikes': get_jwt_identity() }})
		update_idea_creator_rep(idea_id, -1)
	return jsonify(status="disliked successfully")

@voting_bp.route('/remove_idea_dislike', methods=['POST'])
@jwt_required()
def remove_idea_dislike():
	idea_id = request.get_json(silent=True).get('ideaId')
	if get_jwt_identity() in db.idea.find_one({"_id": ObjectId(idea_id)})["dislikes"]:
		db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$pull': {'dislikes': get_jwt_identity() }})
		update_idea_creator_rep(idea_id, 1)
	return jsonify(status="dislike removed successfully")

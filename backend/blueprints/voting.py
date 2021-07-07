from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import serialize, format_ldl, serialize_comment_thread, format_idea

voting = Blueprint('voting', __name__)


@voting.route('/like_idea', methods=['POST'])
@jwt_required()
def like_idea():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'dislikes': get_jwt_identity() }})
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$addToSet': {'likes': get_jwt_identity() }})
	return jsonify(status="liked successfully")

@voting.route('/remove_idea_like', methods=['POST'])
@jwt_required()
def remove_idea_like():
	idea_id = request.get_json(silent=True).get('ideaId')
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'likes': get_jwt_identity() }})
	return jsonify(status="like removed successfully")

@voting.route('/dislike_idea', methods=['POST'])
@jwt_required()
def dislike_idea():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	#remove from likes list if found and add to dislikes list
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'likes': get_jwt_identity() }})
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$addToSet': {'dislikes': get_jwt_identity() }})
	return jsonify(status="disliked successfully")

@voting.route('/remove_idea_dislike', methods=['POST'])
@jwt_required()
def remove_idea_dislike():
	idea_id = request.get_json(silent=True).get('ideaId')
	db.idea.update_one({"_id": ObjectId(idea_id)},
					   {'$pull': {'dislikes': get_jwt_identity() }})
	return jsonify(status="dislike removed successfully")

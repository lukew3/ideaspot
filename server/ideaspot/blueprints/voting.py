from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from ..db import db
from ..tools import update_idea_creator_rep

voting_bp = Blueprint('voting', __name__)

@voting_bp.route('/like_idea', methods=['POST'])
@jwt_required()
def like_idea():
	username = get_jwt_identity()
	idea_id = request.get_json(silent=True).get('ideaId')
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	if not idea: return jsonify({'error': 'Idea not found'}), 404
	elif not username: return jsonify({'error': 'User not found'}), 404
	else:
		existing_vote = db.vote.find_one({"username": username, "ideaId": idea_id})
		if not existing_vote:
			db.vote.insert_one({"username": username, "ideaId": idea_id, "positive": True})
			update_idea_creator_rep(idea_id, 1)
		elif existing_vote['positive']:
			return jsonify(status="Already liked")
		else:
			db.vote.update_one({"username": username, "ideaId": idea_id}, {"$set": {"positive": True}})
			db.idea.update_one({"_id": ObjectId(idea_id)}, {"$inc": {"dislikeCount": -1}})
			update_idea_creator_rep(idea_id, 2)
		db.idea.update_one({"_id": ObjectId(idea_id)}, {"$inc": {"likeCount": 1}})
		return jsonify(status="liked successfully")

@voting_bp.route('/remove_idea_like', methods=['POST'])
@jwt_required()
def remove_idea_like():
	username = get_jwt_identity()
	idea_id = request.get_json(silent=True).get('ideaId')
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	if not idea: return jsonify({'error': 'Idea not found'}), 404
	elif not username: return jsonify({'error': 'User not found'}), 404
	else:
		existing_vote = db.vote.find_one({"username": username, "ideaId": idea_id})
		if not existing_vote: return jsonify(status="No vote found")
		elif not existing_vote['positive']:
			return jsonify(status="Already unliked")
		else:
			db.vote.delete_one({"username": username, "ideaId": idea_id})
			db.idea.update_one({"_id": ObjectId(idea_id)}, {"$inc": {"likeCount": -1}})
			update_idea_creator_rep(idea_id, -1)
			return jsonify(status="like removed successfully")


@voting_bp.route('/dislike_idea', methods=['POST'])
@jwt_required()
def dislike_idea():
	username = get_jwt_identity()
	idea_id = request.get_json(silent=True).get('ideaId')
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	if not idea: return jsonify({'error': 'Idea not found'}), 404
	elif not username: return jsonify({'error': 'User not found'}), 404
	else:
		existing_vote = db.vote.find_one({"username": username, "ideaId": idea_id})
		if not existing_vote:
			db.vote.insert_one({"username": username, "ideaId": idea_id, "positive": False})
			update_idea_creator_rep(idea_id, -1)
		elif not existing_vote['positive']:
			return jsonify(status="Already disliked")
		else:
			db.vote.update_one({"username": username, "ideaId": idea_id}, {"$set": {"positive": False}})
			db.idea.update_one({"_id": ObjectId(idea_id)}, {"$inc": {"likeCount": -1}})
			update_idea_creator_rep(idea_id, 2)
		db.idea.update_one({"_id": ObjectId(idea_id)}, {"$inc": {"dislikeCount": 1}})
		return jsonify(status="Disliked successfully")

@voting_bp.route('/remove_idea_dislike', methods=['POST'])
@jwt_required()
def remove_idea_dislike():
	username = get_jwt_identity()
	idea_id = request.get_json(silent=True).get('ideaId')
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	if not idea: return jsonify({'error': 'Idea not found'}), 404
	elif not username: return jsonify({'error': 'User not found'}), 404
	else:
		existing_vote = db.vote.find_one({"username": username, "ideaId": idea_id})
		if not existing_vote: return jsonify(status="No vote found")
		elif existing_vote['positive']:
			return jsonify(status="Already undisliked")
		else:
			db.vote.delete_one({"username": username, "ideaId": idea_id})
			db.idea.update_one({"_id": ObjectId(idea_id)}, {"$inc": {"dislikeCount": -1}})
			update_idea_creator_rep(idea_id, 1)
			return jsonify(status="Dislike removed successfully")

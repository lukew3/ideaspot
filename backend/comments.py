from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from bson.objectid import ObjectId
from .db import db
from .tools import serialize, format_ldl, serialize_comment_thread, format_idea
import datetime

comments = Blueprint('comments', __name__)


def comments_push_query_creator(parent_ids):
	push_location = "comments.$[comment1].replies"
	array_filters = [ {"comment1._id": ObjectId(parent_ids[0])} ]
	for i in range(len(parent_ids)-1):
		push_location += f".$[reply{i}].replies"
		array_filters.append({f"reply{i}._id": ObjectId(parent_ids[i+1])})
	return push_location, array_filters

@comments.route('/add_comment', methods=['POST'])
@jwt_required()
def add_comment():
    data = request.get_json(silent=True)
    idea_id = data.get('ideaId')
    parent_ids = data.get('parentIds')
    comment_content = (data.get('commentContent')).strip()
    if comment_content == '':
        return jsonify(status="Empty comment; invalid"), 422
    new_id = ObjectId()
    if parent_ids == []:
    	db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$push': {'comments': {'_id': new_id, 'user': get_jwt_identity(), 'comment': comment_content}}})
    else:
        push_location, array_filters = comments_push_query_creator(parent_ids)
        db.idea.update_one({"_id": ObjectId(idea_id)},
            {'$push': {push_location: {'_id': ObjectId(new_id), 'user': get_jwt_identity(), 'comment': comment_content}}},
			upsert=False,
			array_filters=array_filters)
    return jsonify(user=get_jwt_identity(), comment=comment_content, id=str(new_id), status='Comment added successfully')

def comments_delete_query_creator(parent_ids):
	push_location = "comments.$[comment1]"
	array_filters = [ {"comment1._id": ObjectId(parent_ids[0])} ]
	for i in range(len(parent_ids)-1):
		push_location += f".replies.$[reply{i}]"
		array_filters.append({f"reply{i}._id": ObjectId(parent_ids[i+1])})
	return push_location, array_filters

def get_comment_replies(idea_id, ids_list):
	""" Returns true if the comment has replies, false if it doesn't """
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	comment = {}
	for item in idea['comments']:
		if str(item['_id']) == ids_list[0]:
			comment = item
	i = 0
	for this_id in ids_list:
		if i == 0:
			i = 1
			continue
		#print(comment)
		#print(comment['replies'])
		for item in comment['replies']:
			if str(item['_id']) == this_id:
				comment = item
	try:
		return comment['replies']
	except Exception:
		return []

@comments.route('/delete_comment', methods=['POST'])
@jwt_required()
def delete_comment():
	data = request.get_json(silent=True)
	idea_id = data.get('ideaId')
	ids_list = data.get('idsList') #list of parent ids including the current id
	# use $set to set comment.comment to <Deleted> and comment.user to <Deleted>
	idea = db.idea.find_one({"_id": ObjectId(idea_id)})
	if get_jwt_identity() != idea['creator']:
		return jsonify(status='Must be signed in as idea creator to delete comment'), 403
	#Set text and user to <Deleted> if there are replies but remove completely if there are not
	replies = get_comment_replies(idea_id, ids_list)
	if (len(replies) > 0):
		push_location, array_filters = comments_delete_query_creator(ids_list)
		db.idea.update_one({"_id": ObjectId(idea_id)},
			{'$set': {push_location: {'_id': ObjectId(ids_list[-1]), 'user': "<Deleted>", 'comment': "<Deleted>", 'replies': replies}}},
			upsert=False,
			array_filters=array_filters)
	else:
		if len(ids_list) == 1:
			pull_location = "comments"
			array_filters = []
		else:
			pull_location, array_filters = comments_push_query_creator(ids_list[:-1])
		db.idea.update_one({"_id": ObjectId(idea_id)},
            {'$pull': {pull_location: {'_id': ObjectId(ids_list[-1])}}},
			upsert=False,
			array_filters=array_filters)
	return jsonify(status='Comment deleted successfully')

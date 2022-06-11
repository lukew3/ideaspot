from bson.objectid import ObjectId
from .db import db

def clean_list(ideas, username):
	#cast to list in case ideas is a cursor
	ideas = list(ideas)
	for idea in ideas:
		# Converts _id from ObjectId to string
		idea['_id'] = str(idea['_id'])

		vote = db.vote.find_one({"ideaId": idea['_id'], "username": username})
		if not vote:
			idea['disliked'] = False
			idea['liked'] = False
		else:
			idea['liked'] = vote['positive']
			idea['disliked'] = not vote['positive']

		# Handle revisions
		idea["revisionTimes"] = []
		for revision in idea["history"]:
			idea["revisionTimes"].append(revision["time"])
		idea["revisionTimes"].append(idea["last_updated_at"])

		if "comments" in idea:
			idea.pop("comments")
		if "builders" in idea:
			idea.pop("builders")
	return ideas

def serialize_comment_thread(comment):
	comment["_id"] = str(comment["_id"])
	if "replies" in comment:
		for i in range(len(comment["replies"])):
			comment["replies"][i] = serialize_comment_thread(comment["replies"][i])
	return comment

def get_my_build_status(idea, username):
	if "builders" in idea:
		for k in idea['builders']:
			if k == 'built':
				for item in idea['builders'][k]:
					if item['user'] == username:
						return(k, item['link'])
			else:
				if username in idea['builders'][k]:
					return(k, '')
	else:
		return('not_building', '')
	return('not_building', '')

def format_idea(idea, username, revNum=-1):
	""" Format idea before it is sent """
	# Converts _id from ObjectId to string
	idea['_id'] = str(idea['_id'])
	# Remove excessive like data and add user like/dislike status
	vote = db.vote.find_one({"ideaId": idea['_id'], "username": username})
	if not vote:
		idea['disliked'] = False
		idea['liked'] = False
	else:
		idea['liked'] = vote['positive']
		idea['disliked'] = not vote['positive']

	# Handle revisions
	if revNum != -1 and revNum < len(idea["history"]):
		idea["title"] = idea["history"][revNum]["title"]
		idea["description"] = idea["history"][revNum]["description"]

	idea["revisionTimes"] = []
	for revision in idea["history"]:
		idea["revisionTimes"].append(revision["time"])
	idea["revisionTimes"].append(idea["last_updated_at"])

	# Set build status
	idea['myBuildStatus'], idea["myBuildLink"] = get_my_build_status(idea, username)

	# Clean builders data
	if "builders" in idea:
		if "built" in idea['builders']:
			idea['builds'] = idea['builders']['built']
		if "building" in idea['builders']:
			idea['buildingCount'] = len(idea['builders']['building'])
		if "plan_to_build" in idea['builders']:
			idea['planToBuildCount'] = len(idea['builders']['plan_to_build'])
		idea.pop('builders')

	# Turn comment _ids from ObjectIds to strings
	if "comments" in idea:
		for i in range(len(idea["comments"])):
			idea["comments"][i] = serialize_comment_thread(idea["comments"][i])
	return idea

def update_rep(username, score_change):
	db.user.update_one({"username": username}, {"$inc":{"reputation":score_change}})

def update_idea_creator_rep(idea_id, score_change):
	update_rep(db.idea.find_one({"_id": ObjectId(idea_id)})["creator"], score_change)

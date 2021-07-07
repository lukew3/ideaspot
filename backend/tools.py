from bson.objectid import ObjectId

def serialize(dct):
	#turns object id fields to strings
	for k in dct:
		if isinstance(dct[k], ObjectId):
			dct[k] = str(dct[k])
	return dct

def format_ldl(idea, username, ldl):
	#ldl stands for like-dislike
	#ldl is either "like" or "dislike"
	try:
		idea[ldl + "Count"] = len(idea[ldl + "s"])
		if username in idea[ldl + "s"]:
			idea[ldl + "d"] = True
		else:
			idea[ldl + "d"] = False
		idea.pop(ldl + "s")
	except Exception as e:
		idea[ldl + "Count"] = 0
		idea[ldl + "d"] = False
	return idea

def serialize_comment_thread(comment):
	comment["_id"] = str(comment["_id"])
	try:
		for i in range(len(comment["replies"])):
			comment["replies"][i] = serialize_comment_thread(comment["replies"][i])
	except Exception:
		pass
	return comment

def format_idea(idea, username, revNum=-1):
	#formats the idea before it is sent
	idea = serialize(idea)
	idea = format_ldl(idea, username, "like")
	idea = format_ldl(idea, username, "dislike")

	idea["revisionTime"] = idea["revisions"][revNum]["time"]
	idea["title"] = idea["revisions"][revNum]["title"]
	idea["description"] = idea["revisions"][revNum]["description"]
	idea["revisionTimes"] = []
	for revision in idea["revisions"]:
		idea["revisionTimes"].append(revision["time"])

	try:
		for i in range(len(idea["comments"])):
			idea["comments"][i] = serialize_comment_thread(idea["comments"][i])
	except Exception:
		pass
	return idea

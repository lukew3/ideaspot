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

def clean_list(ideas, username):
	#cast to list in case ideas is a cursor
	ideas = list(ideas)
	for idea in ideas:
		# Converts _id from ObjectId to string
		idea = serialize(idea)
		# Remove excessive like data and add user like/dislike status
		idea = format_ldl(idea, username, "like")
		idea = format_ldl(idea, username, "dislike")

		# Handle revisions
		idea["revisionTime"] = idea["revisions"][-1]["time"]
		idea["title"] = idea["revisions"][-1]["title"]
		idea["description"] = idea["revisions"][-1]["description"]
		idea["revisionTimes"] = []
		for revision in idea["revisions"]:
			idea["revisionTimes"].append(revision["time"])

		if "comments" in idea:
			idea.pop("comments")
		if "builders" in idea:
			idea.pop("builders")
	return ideas

def serialize_comment_thread(comment):
	comment["_id"] = str(comment["_id"])
	try:
		for i in range(len(comment["replies"])):
			comment["replies"][i] = serialize_comment_thread(comment["replies"][i])
	except Exception:
		pass
	return comment

def format_idea(idea, username, revNum=-1):
	""" Format idea before it is sent """
	# Converts _id from ObjectId to string
	idea = serialize(idea)
	# Remove excessive like data and add user like/dislike status
	idea = format_ldl(idea, username, "like")
	idea = format_ldl(idea, username, "dislike")

	# Handle revisions
	idea["revisionTime"] = idea["revisions"][revNum]["time"]
	idea["title"] = idea["revisions"][revNum]["title"]
	idea["description"] = idea["revisions"][revNum]["description"]
	idea["revisionTimes"] = []
	for revision in idea["revisions"]:
		idea["revisionTimes"].append(revision["time"])

	# Set build status
	if "builders" in idea:
		for k in idea['builders']:
			if k == 'built':
				for item in idea['builders'][k]:
					if item['user'] == username:
						idea["myBuildStatus"] = k
						idea["myBuildLink"] = item['link']
			else:
				if username in idea['builders'][k]:
					idea["myBuildStatus"] = k
	else:
		idea['myBuildStatus'] = 'not_building'

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

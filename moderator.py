# Command line interface to moderate ideaspot
"""
* Add options to tell the user why their idea was rejected
  * Off-topic/not an idea
  * illegal/criminal
  * repost/Clone of existing idea
    * Could have the moderator check for clone
* j - confirm good
* k - clone
* o - off-topic
* l - illegal
"""
from pymongo import MongoClient
client = MongoClient()
db = client.ideaspot

def main():
    print("Rulings list:")
    print("1 - accept")
    print("2 - off-topic/not an idea")
    print("3 - repost")
    print("4 - illegal")
    # Get ideas that need to be reviewed
    ideas = list(db.idea.find({"mod_ruling": "pending", "private": False}))
    print(f"\n{len(ideas)} ideas awaiting review\n")

    for idea in ideas:
        handle_idea(idea)

def handle_idea(idea):
    print("--------------------------------")
    print("TITLE: " + idea["title"])
    print("DESCRIPTION: " + idea["description"])
    ruling = input('>')
    if ruling == '1':
        db.idea.update_one({"_id": idea["_id"]}, {"$set": {"mod_ruling": "accepted"}})
        creator = db.idea.find_one({"_id": idea["_id"]})["creator"]
        db.user.update_one({"username": creator, {"$inc": {"reputation": 5}}})
        print("Marked as accepted")
    elif ruling == '2':
        db.idea.update_one({"_id": idea["_id"]}, {"$set": {"mod_ruling": "off-topic"}})
        print("Marked as off-topic")
    elif ruling == '3':
        db.idea.update_one({"_id": idea["_id"]}, {"$set": {"mod_ruling": "repost"}})
        print("Marked as repost")
    elif ruling == '4':
        db.idea.update_one({"_id": idea["_id"]}, {"$set": {"mod_ruling": "illegal"}})
        print("Marked as illegal")
    else:
        print("invalid ruling, skipping")

if __name__ == "__main__":
    main()

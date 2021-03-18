import click
from pymongo import MongoClient
import json
import os

client = MongoClient()
db = client.buildmyidea

with open('config.json') as config_file:
	config = json.load(config_file)

@click.group()
def cli():
    pass

@cli.command()
@click.argument('old_username')
@click.argument('new_username')
def renameuser(old_username, new_username):
    """ Rename a user in the database, replace all instances of name """
    db.user.update_one({"username": old_username}, { "$set": {"username": new_username} })
    db.idea.update_many({"creator": old_username }, { "$set": { "creator": new_username } })
    print("User " + old_username + " renamed to: " + new_username)

@cli.command()
def deploy():
    """ Deploy to server """
    password = config.get('SERVER_PASSWORD')
    script = f"""
      echo "Building app"
      cd frontend
      npm run build
      echo "Deploying build files to server"
      rsync -avP build/ luke@lukew3.com:/home/luke/buildmyidea/build/
      echo "Git pulling on server"
      ssh luke@lukew3.com << DONE
      cd ~/buildmyidea
      git pull
      cd ..
      echo {password} | sudo -S ./notes
      DONE
      echo "Deployment complete"
    """
    os.system(script)


if __name__ == "__main__":
    cli()

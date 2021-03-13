from flask import Flask, flash, request, redirect, url_for, render_template, send_from_directory, jsonify, Response
from flask_cors import CORS
from flask_mongoengine import MongoEngine
import json

app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'db': 'buildmyidea',
    'host': 'localhost',
    'port': 27017
}
db = MongoEngine()
db.init_app(app)
cors = CORS(app)


class Idea(db.Document):
    #id = db.StringField()
    title = db.StringField()
    details = db.StringField()
    def to_json(self):
        return {"_id": str(self.pk),
                "title": self.title,
                "details": self.details}


@app.route('/api/new_idea', methods=['POST'])
def new_idea():
    title = request.form.get('title')
    details = request.form.get('details')
    new_idea = Idea(title=title, details=details).save()
    return new_idea.to_json()


@app.route('/api/get_ideas', methods=['GET'])
def get_ideas():
    ideas = (Idea.objects().all())
    for object in ideas:
        object = object.to_json()
    return jsonify(ideas=ideas)


if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = '57916234ab0b13ce0c676dfde280ba245'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    join_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    ideas = db.relationship('Idea', backref='author', lazy=True)
    votes = db.relationship('IdeaVote', backref='voter', lazy=True)
    comments = db.relationship('Comment', backref='commenter', lazy=True)
    buildsComplete = db.relationship('BuildComplete', backref='builder', lazy=True)
    buildsInProgress = db.relationship('BuildInProgress', backref='builder', lazy=True)
    buildsPlanned = db.relationship('BuildPlanned', backref='builder', lazy=True)

class Idea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    private = db.Column(db.Boolean, default=False)
    
    versions = db.relationship('IdeaVersion', backref='idea', lazy=True)
    votes = db.relationship('IdeaVote', backref='idea', lazy=True)
    comments = db.relationship('Comment', backref='idea', lazy=True)
    buildsComplete = db.relationship('BuildComplete', backref='idea', lazy=True)
    buildsInProgress = db.relationship('BuildInProgress', backref='idea', lazy=True)
    buildsPlanned = db.relationship('BuildPlanned', backref='idea', lazy=True)

class IdeaVersion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class IdeaVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    voter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    is_positive = db.Column(db.Boolean, nullable=False, default=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poster_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reply_to = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    content = db.Column(db.String(1000), nullable=False)

    replies = db.relationship('Comment', backref='parent', lazy=True)

class BuildComplete(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    url = db.Column(db.String(256), nullable=False)

class BuildInProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class BuildPlanned(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


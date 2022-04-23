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


# Auth routes
blocked_usernames = ['about', 'donate', 'myIdeas','idea','login','register','newIdea','editIdea','trash','settings','<Deleted>']
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    username = data.get('username')
    if username in blocked_usernames:
        return "<p>Invalid username</p>"
    password = data.get('password')
    new_user = User(username=username, password=password, email=email)
    db.add(new_user)
    db.commit()
    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)
    return jsonify(access_token=access_token, refresh_token=refresh_token, username=username)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User.query.filter_by(email=username).first()
    if user and data.get('password') == user.password:
        access_token = create_access_token(identity=user.username)
        refresh_token = create_refresh_token(identity=user.username)
        return jsonify(success=True, access_token=access_token, refresh_token=refresh_token,username=user.username)
    else:
        return jsonify({"message": "Incorrect username/email or password"})

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)

@user_bp.route('/user/<username>', methods=['GET'])
@jwt_required(optional=True)
def get_user(username):
    user = User.query.filter_by(username=username).first()
    user_ideas = Idea.query.filter_by(creator_id=User.id).all()
    user_json = {username: user.username, ideas:[]}
    for idea in user_ideas:
        ideav = IdeaVersions.query.filter_by(idea_id=idea.id).first() #private?
        title = ideav.title
        description = ideav.description
        user_json['ideas'].append({'id':idea.id, 'title':title, 'description':description})
    return jsonify(user_json)

@idea_bp.route('/create_idea', methods=['POST'])
@jwt_required()
def create_idea():
    data = request.get_json(silent=True)
    if data.get('title') == '':
        return jsonify(status="idea must have a title")
    creator = User.query.filter_by(username=get_jwt_identity()).first()
    new_idea = Idea(creator_id=creator.id, private=data.get('private'))
    db.add(new_idea)
    db.commit()
    new_idea_version = IdeaVersion(idea_id=new_idea.id, title=data.get('title'), description=data.get('description'))
    auto_upvote = IdeaVote(voter_id=creator.id, idea_id=new_idea.id)#, is_positive=True)
    db.add(new_idea_version)
    db.add(auto_upvote)
    db.commit()
    return jsonify(id=new_idea.id)

@idea_bp.route('/edit_idea/<ideaId>', methods=['PATCH'])
@jwt_required()
def edit_idea(ideaId):
    data = request.get_json(silent=True)
    current_user = get_jwt_identity()
    idea = Idea.query.filter_by(id=ideaId)
	# if privacy is the only thing that changed, don't create a duplicate revision
    if (data.get('title') == idea.title and data.get('description') == idea.description):
        idea.update(private=data.get('private'))
    else:
        new_version = IdeaVersion(idea_id=idea.id, title=data.get('title'), description=data.get('description'))
        db.add(new_version)
    db.commit()
    idea_json = {'id':idea.id, 'title':new_version.title, 'description':new_version.description, 'creator':current_user}
    return jsonify(idea_json)

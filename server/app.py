from flask import Flask, Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
import datetime
from flask_cors import CORS
import json

"""
with open('config.json') as config_file:
                config = json.load(config_file)
"""

#app = Flask(__name__)
app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config['SECRET_KEY'] = '57916234ab0b13ce0c676dfde280ba245'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#initialize cors
CORS().init_app(app)

#initialize jwt
app.config["JWT_SECRET_KEY"] = '57916234ab0b13ce0c676dfde280ba245'#config.get('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(weeks=26)
jwt = JWTManager(app)

api_bp = Blueprint('api', __name__)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    join_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

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
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

class IdeaVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    voter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    is_positive = db.Column(db.Boolean, nullable=False, default=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poster_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    #reply_to = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    content = db.Column(db.String(1000), nullable=False)

    #replies = db.relationship('Comment', backref='parent', lazy=True)

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

db.create_all()

@app.route('/')
def index():
        return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
  return app.send_static_file('index.html')

auth_bp = Blueprint('auth', __name__)

# Auth routes
blocked_usernames = ['about', 'donate', 'myIdeas','idea','login','register','newIdea','editIdea','trash','settings','<Deleted>']
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    username = data.get('username')
    email = data.get('email') # Need to check if email is email-like
    if username in blocked_usernames:
        return "<p>Invalid username</p>"
    password = data.get('password')
    new_user = User(username=username, password=password, email=email)
    db.session.add(new_user)
    db.session.commit()
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

user_bp = Blueprint('user', __name__)

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

idea_bp = Blueprint('idea', __name__)

@idea_bp.route('/create_idea', methods=['POST'])
@jwt_required()
def create_idea():
    data = request.get_json(silent=True)
    if data.get('title') == '':
        return jsonify(status="idea must have a title")
    creator = User.query.filter_by(username=get_jwt_identity()).first()
    new_idea = Idea(creator_id=creator.id, private=data.get('private'))
    db.session.add(new_idea)
    db.session.commit()
    new_idea_version = IdeaVersion(idea_id=new_idea.id, title=data.get('title'), description=data.get('description'))
    auto_upvote = IdeaVote(voter_id=creator.id, idea_id=new_idea.id)#, is_positive=True)
    db.session.add(new_idea_version)
    db.session.add(auto_upvote)
    db.session.commit()
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
        db.session.add(new_version)
    db.session.commit()
    idea_json = {'id':idea.id, 'title':new_version.title, 'description':new_version.description, 'creator':current_user}
    return jsonify(idea_json)

@idea_bp.route('/get_idea/<ideaId>', defaults={'revNum': -1}, methods=['GET'])
@idea_bp.route('/get_idea/<ideaId>/<revNum>', methods=['GET'])
@jwt_required(optional=True)
def get_idea(ideaId, revNum):
    revNum = int(revNum)
    idea = Idea.query.filter_by(id=ideaId).first()
    idea_v = IdeaVersion.query.filter_by(idea_id=ideaId).first()
    # idea_obj = format_idea(db.idea.find_one({"_id": ObjectId(ideaId)}), get_jwt_identity(), revNum=revNum)
    """
    if idea.private == True and idea_obj["creator"] != get_jwt_identity():
        return jsonify(idea="unauthorized")
    if "delete_date" in idea_obj and idea_obj["creator"] != get_jwt_identity():
        return jsonify(idea="deleted")
    """
    return jsonify(title=idea_v.title, description=idea_v.description)


@idea_bp.route('/get_ideas', methods=['GET'])
@jwt_required(optional=True)
def get_ideas():
    print("INSIDE")
    if 'page' in request.args:
        page = int(request.args['page'])
    else:
        page = 1
    page = 1
    ideas = Idea.query.paginate(page, 10, False).items
    ideas_json = []
    for idea in ideas:
        ideav = IdeaVersion.query.filter_by(idea_id=idea.id).first()
        ideas_json.append({'title':ideav.title,'description':ideav.description})
    return jsonify({'ideas':ideas_json, 'maxPage':100})


api_bp.register_blueprint(auth_bp)
#api_bp.register_blueprint(comments_bp)
api_bp.register_blueprint(idea_bp)
#api_bp.register_blueprint(list_bp)
api_bp.register_blueprint(user_bp)
#api_bp.register_blueprint(voting_bp)

app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == "__main__":
        app.run(port=5001, debug=True)

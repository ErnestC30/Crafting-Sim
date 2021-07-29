from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
import os

db = SQLAlchemy()
DB_NAME = "equip.sqlite3"
load_dotenv()

def create_app(): 
    app = Flask(__name__)

    #Initialize and configure Database objects 
    app.config['SECRET_KEY'] = os.getenv('FLASK_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    from .views import views
    app.register_blueprint(views, url_prefix='/')
    
    from .models import EquipDB, User
    create_database(app)

    loginManager = LoginManager()
    loginManager.login_view = 'views.login'
    loginManager.init_app(app)

    #Tracks the logged in user using flask_login module.
    @loginManager.user_loader
    def loadUser(id):
        return User.query.get(int(id))

    return app

def create_database(app):
    if not os.path.exists('website/' + DB_NAME):
        db.create_all(app=app)

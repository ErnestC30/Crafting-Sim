from flask import Blueprint, render_template, request, jsonify, url_for, redirect, flash
from .models import EquipDB, User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from datetime import date

views = Blueprint('views', __name__)

@views.route('/')
@views.route('/home')
def home():
    return render_template("home.html", user=current_user)

#Page for users to create equipment.
@views.route('/crafting', methods=["POST", "GET"])
@login_required
def crafting():
    if request.method == "POST":
        print("Equipment information recieved.")
        #Retrieve the equipment JSON file and parse into object notation.
        equip = request.get_json()

        #Store the equipment information into the database.
        equipment = EquipDB(equip, current_user.name, date.today())
        db.session.add(equipment)
        db.session.commit()
        print('Equipment information added to database.')
        return 'OK', 200
    else:
        return render_template("crafting.html", user=current_user)

#Page for user to view previously made equipment.
@views.route('/crafts', methods=["POST", "GET"])
@login_required
def crafts():

    saved_equips = EquipDB.query.filter_by(userName=current_user.name)
    ordered_equips = []

    if request.method == "POST":
        #Removes equipment with given rowID from the database.
        if 'remove' in request.get_json()['methods']:
            rowID = request.get_json()['rowToDelete']
            EquipDB.query.filter_by(userName=current_user.name).filter(EquipDB.id == rowID).delete()
            db.session.commit()
            equips = EquipDB.query.all()
            
        #Sorts the table in ascending/descending order.
        if 'sort' in request.get_json()['methods']:
            colType = request.get_json()['sortType']
            sortType = request.get_json()['sortBy']
            if sortType == 'des':
                equips = EquipDB.query.filter_by(userName=current_user.name).order_by(EquipDB.getAttribute(colType).desc()).all()
            elif sortType == 'asc':
                equips = EquipDB.query.filter_by(userName=current_user.name).order_by(EquipDB.getAttribute(colType).asc()).all()

        #Returns the queried table as a JSON object containing list of equipment to crafts.js where it updates HTML table.
        for equip in equips:
            ordered_equips.append(equip.toJson())
        return jsonify(ordered_equips)
            
    return render_template("crafts.html", saved_equips=saved_equips, user=current_user)

@views.route('/leaderboard', methods=["POST", "GET"])
def leaderboard():
    #TO DO:
    #Datetime added to equipments database to track time
    #Two leaderboards? One for daily, one for overall
    #Click on column to sort by column (can use similar code from crafts.js)

    saved_equips = EquipDB.query.order_by(EquipDB.getAttribute('gs').desc()).limit(10)

    return render_template("leaderboard.html", saved_equips=saved_equips, user=current_user)

@views.route('/register', methods=["POST", "GET"])
def register():
    
    if request.method == "POST" and 'name' in request.form and 'pw' in request.form:
        name = request.form['name']
        pw = request.form['pw']
        pw2 = request.form['pw2']

        #Form error handling
        if len(name) == 0 or len(pw) == 0 or len(pw2) == 0:
            flash('Please fill in all fields.', category='error')
        elif len(name) < 3:
            flash('Username must be longer than 3 characters!', category='error')
        elif len(pw) < 3:
            flash('Password must be longer than 3 characters!', category='error')
        elif pw != pw2: 
            flash('Passwords do not match each other!', category='error')
        else:
            #Check if username already taken
            check_user = User.query.filter_by(name=name).first()
            if check_user:
                flash('Account name is already taken!', category='error')

            else: 
                #Create account into database here.
                newUser = User(name=name, pw=generate_password_hash(pw, method='sha256'))
                db.session.add(newUser)
                db.session.commit()
                flash('Account created! Redirected to login page.', category='success')
                return redirect(url_for('views.login'))
            
    return render_template("register.html", user=current_user)

@views.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        name = request.form['name']
        pw = request.form['pw']

        if len(name) == 0 or len(pw) == 0:
            flash('Please fill in all fields.', category='error')
        
        user = User.query.filter_by(name=name).first()
        if user:
        #Check password
            if check_password_hash(user.pw, pw):
                #Redirect to home page and log user to flask_login
                login_user(user, remember=True)
                flash(f'You are now logged in, {user.name}', category='success')
                return redirect(url_for('views.home'))
            else:
                flash('The password is incorrect, try again.', category='error')
        else:
            flash('Username does not exist.', category='error')

    return render_template("login.html", user=current_user)

@views.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You are now logged out.', category='success')
    return redirect(url_for('views.login'))



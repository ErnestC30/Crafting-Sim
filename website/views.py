from flask import Blueprint, render_template, request, jsonify, url_for, flash
from .models import EquipDB
from . import db

views = Blueprint('views', __name__)

@views.route('/')
@views.route('/home')
def home():
    return render_template("home.html")

@views.route('/crafting', methods=["POST", "GET"])
def crafting():
    if request.method == "POST":
        print("Equipment information recieved.")
        #Retrieve the equipment JSON file and parse into object notation.
        equip = request.get_json()

        #Store the equipment information into the database.
        equipment = EquipDB(equip)
        db.session.add(equipment)
        db.session.commit()
        print('Equipment information added to database.')
        return 'OK', 200
    else:
        return render_template("crafting.html")
    
@views.route('/crafts', methods=["POST", "GET"])
def crafts():

    saved_equips = EquipDB.query.all()
    ordered_equips = []

    if request.method == "POST":

        #Removes equipment with given rowID from the database.
        if 'remove' in request.get_json()['methods']:
            rowID = request.get_json()['rowToDelete']
            EquipDB.query.filter(EquipDB.id == rowID).delete()
            db.session.commit()
            equips = EquipDB.query.all()
            
        #Sorts the table in ascending/descending order.
        if 'sort' in request.get_json()['methods']:
            colType = request.get_json()['sortType']
            sortType = request.get_json()['sortBy']
            if sortType == 'des':
                equips = EquipDB.query.order_by(EquipDB.getAttribute(colType).desc()).all()
            elif sortType == 'asc':
                equips = EquipDB.query.order_by(EquipDB.getAttribute(colType).asc()).all()

        #Sends the database as a JSON object containing list of equipment to crafts.js to update HTML table.
        for equip in equips:
            ordered_equips.append(equip.toJson())
        return jsonify(ordered_equips)
            
    return render_template("crafts.html", saved_equips=saved_equips)

@views.route('/register', methods=["POST", "GET"])
def register():
    
    if request.method == "POST" and 'name' in request.form and 'pw' in request.form:
        name = request.form['name']
        pw = request.form['pw']
        pw2 = request.form['pw2']
        print(name, pw, pw2)

        if len(name) < 3:
            flash('Username must be longer than 3 characters!', category="error")
        elif len(pw) < 4:
            flash('Password must be longer than 3 characters!', category='error')
        elif pw != pw2: 
            flash('Passwords do not match each other!', category='error')
        else:
            flash('Account created!', category="success")
            #Create account into database here.
        
    return render_template("register.html")

@views.route('/login', methods=["POST", "GET"])
def login():
    #TO DO: Check database for username 
    #       Check if entered password matches the hashed password when hashed
    #       If matches, return to Home page with hello 'user'

    return render_template("login.html")



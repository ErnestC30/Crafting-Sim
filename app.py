from flask import Flask, redirect, url_for, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///equip.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

#equipment Class creates a row in table for the given equip
class equipment(db.Model):
    id   = db.Column('id', db.Integer, primary_key=True)
    type = db.Column('Type', db.String(20))
    atkP = db.Column('Atk%', db.Integer, default=0)
    atkF = db.Column('Atk', db.Integer, default=0)
    defP = db.Column('Def%', db.Integer, default=0)
    defF = db.Column('Def', db.Integer, default=0)
    hpP  = db.Column('Hp%', db.Integer, default=0)
    hpF  = db.Column('Hp', db.Integer, default=0)
    criC = db.Column('CritC', db.Integer, default=0)
    criD = db.Column('CritD', db.Integer, default=0)
    spd  = db.Column('Spd', db.Integer, default=0)
    eff  = db.Column('Eff', db.Integer, default=0)
    effR = db.Column('EffRes', db.Integer, default=0)
    gs   = db.Column('Score', db.Integer, default=0)
    
    #Goes through the equip object and stores the type and stats into the database.
    def __init__(self, equip):
        self.type = equip['type']
        for stat in equip['stats']:
            if stat['statType'] == 'Attack %':
                self.atkP = stat['value']
            elif stat['statType'] == 'Attack':
                self.atkF = stat['value']
            elif stat['statType'] == 'Defense %':
                self.defP = stat['value']
            elif stat['statType'] == 'Defense':
                self.defF = stat['value']
            elif stat['statType']== 'Health %':
                self.hpP = stat['value']
            elif stat['statType'] == 'Health':
                self.hpF = stat['value']
            elif stat['statType'] == 'Critical Chance %':
                self.criC = stat['value']
            elif stat['statType'] == 'Critical Damage %':
                self.criD = stat['value']
            elif stat['statType'] == 'Speed':
                self.spd = stat['value']
            elif stat['statType'] == 'Effectiveness':
                self.eff = stat['value']
            else: 
                self.effR = stat['value']
        self.gs = equip['gearScore']

    #Convert stats into dictionary format to be jsonify'd.
    def toJson(self): 
        return {
            'id':   self.id,
            'type': self.type,
            'atkP': self.atkP,
            'atkF': self.atkF,
            'defP': self.defP,
            'defF': self.defF,
            'hpP' : self.hpP,
            'hpF' : self.hpF,
            'criC': self.criC,
            'criD': self.criD,
            'spd' : self.spd,
            'eff' : self.eff,
            'effR': self.effR,
            'gs'  : self.gs
        }

    #Returns the given attribute call for equipment. 
    def getAttribute(attr):
        if attr == 'type':
            return equipment.type
        elif attr == 'atkP':
            return equipment.atkP
        elif attr == 'atkF':
            return equipment.atkF
        elif attr == 'defP':
            return equipment.defP
        elif attr == 'defF':
            return equipment.defF
        elif attr == 'hpP':
            return equipment.hpP
        elif attr == 'hpF':
            return equipment.hpF
        elif attr == 'criC':
            return equipment.criC
        elif attr == 'criD':
            return equipment.criD
        elif attr == 'spd':
            return equipment.spd
        elif attr == 'eff':
            return equipment.eff
        elif attr == 'effR':
            return equipment.effR
        else:
            return equipment.gs
        

@app.route('/')
@app.route('/home')
def home():
    return render_template("home.html")

@app.route('/crafting', methods=["POST", "GET"])
def crafting():
    if request.method == "POST":
        print("Equipment information recieved.")
        #Retrieve the equipment JSON file and parse into object notation.
        equip = request.get_json()

        #Store the equipment information into the database.
        equipDB = equipment(equip)
        db.session.add(equipDB)
        db.session.commit()
        print('Equipment information added to database.')
        return 'OK', 200
    else:
        return render_template("crafting.html")
    
@app.route('/crafts', methods=["POST", "GET"])
def crafts():

    saved_equips = equipment.query.all()
    ordered_equips = []

    if request.method == "POST":

        #Removes equipment with given rowID from the database.
        if 'remove' in request.get_json()['methods']:
            rowID = request.get_json()['rowToDelete']
            equipment.query.filter(equipment.id == rowID).delete()
            db.session.commit()
            equips = equipment.query.all()
            
        #Sorts the table in ascending/descending order.
        if 'sort' in request.get_json()['methods']:
            colType = request.get_json()['sortType']
            sortType = request.get_json()['sortBy']
            if sortType == 'des':
                equips = equipment.query.order_by(equipment.getAttribute(colType).desc()).all()
            elif sortType == 'asc':
                equips = equipment.query.order_by(equipment.getAttribute(colType).asc()).all()

        #Sends the database as a JSON object containing list of equipment to crafts.js to update HTML table.
        for equip in equips:
            ordered_equips.append(equip.toJson())
        return jsonify(ordered_equips)
            
    return render_template("crafts.html", saved_equips=saved_equips)

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)
    
from flask import Flask, redirect, url_for, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy

#Use bootstrap to handle CSS/JS part?, SQLAlchemy for database, AJAX/JQuery for update info?

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///equip.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class equipment(db.Model):
    #equipment Class creates a row in table for the given equip
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
    
    def __init__(self, equip):
        #Goes through the equip object and stores the type and stats into the database.
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

    #Convert stats into dictionary format to be jsonify'd.
    def toJson(self): 
        return {
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
            'effR': self.effR
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
        else: 
            return equipment.effR
        

@app.route('/')
@app.route('/home')
def home():
    return render_template("home.html")

@app.route('/crafting', methods=["POST", "GET"])
def crafting():
    if request.method == "POST":
        print("Something recieved.")
        #Retrieve the equipment JSON file and parse into object notation.
        equip = request.get_json()

        #Store the equipment information into the database.
        equipDB = equipment(equip)
        db.session.add(equipDB)
        db.session.commit()
        print('Something added to database.')
        return 'OK', 200
    else:
        return render_template("crafting.html")
    
@app.route('/crafts', methods=["POST", "GET"])
def crafts():

    saved_equips = equipment.query.all()

    if request.method == "POST":
        colType = request.get_json()['sortType']
        equips = equipment.query.order_by(equipment.getAttribute(colType)).all()
        ordered_equips = []
        for equip in equips:
            ordered_equips.append(equip.toJson())
        
        return jsonify(ordered_equips)
        

    return render_template("crafts.html", saved_equips=saved_equips)

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)
    
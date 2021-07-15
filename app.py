from flask import Flask, redirect, url_for, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy

#Use bootstrap to handle CSS/JS part?, SQLAlchemy for database, AJAX/JQuery for update info?

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///equip.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

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
    
    def __init__(self, equip):
        self.type = equip['type']
        for stat in equip['stats']:
            #NEED TO USE stat['whatever'] INSTEAD OF stat.whatever??
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
        print(equip)
        #Store the equipment information into the database.
        equipDB = equipment(equip)
        db.session.add(equipDB)
        db.session.commit()
        print('Something added to database.')
        return 'OK', 200
    else:
        return render_template("crafting.html")
    
@app.route('/crafts')
def crafts():
    return render_template("crafts.html")

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)
    
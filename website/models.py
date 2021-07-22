from . import db

#equipment Class creates a row in table for the given equip
class EquipDB(db.Model):
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
            return EquipDB.type
        elif attr == 'atkP':
            return EquipDB.atkP
        elif attr == 'atkF':
            return EquipDB.atkF
        elif attr == 'defP':
            return EquipDB.defP
        elif attr == 'defF':
            return EquipDB.defF
        elif attr == 'hpP':
            return EquipDB.hpP
        elif attr == 'hpF':
            return EquipDB.hpF
        elif attr == 'criC':
            return EquipDB.criC
        elif attr == 'criD':
            return EquipDB.criD
        elif attr == 'spd':
            return EquipDB.spd
        elif attr == 'eff':
            return EquipDB.eff
        elif attr == 'effR':
            return EquipDB.effR
        else:
            return EquipDB.gs
        




//Create an equipment object and modify its stats.

class Equipment {
    constructor(rarity='epic') {
        let typePool = ['Weapon', 'Helmet', 'Body Armor', 'Necklace', 'Ring', 'Boot'];
        this.type = typePool[Math.floor(Math.random() * typePool.length)];
        this.rarity = rarity
        this.stats = this.initializeStats(this.rarity, this.type)
        this.numOfEnhance = 0
        this.saved = false
        this.gearScore = 0;
    }

    //Create the initial stats and returns the stats as an array of Stat objects
    initializeStats(rarity, type){
        let numStats = 4 //Assuming epic gear
        let stats = [];
        let statPool;
        let usedStatIndex;
        switch(type){
            case 'Weapon':
                statPool = ['Attack %', 'Health %', 'Health', 'Speed', 'Critical Chance %', 'Critical Damage %', 'Effectiveness', 'Effect Resistance'];
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    //Remove the used stat from possible stat pool to prevent duplicate
                    usedStatIndex = statPool.indexOf(stats[i].statType); 
                    statPool.splice(usedStatIndex, 1); 
                }
            case 'Helmet':
                statPool = ['Attack %', 'Attack', 'Health %', 'Defense %', 'Defense', 'Speed', 'Critical Chance %', 'Critical Damage %', 'Effectiveness', 'Effect Resistance']; 
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    usedStatIndex = statPool.indexOf(stats[i].statType); 
                    statPool.splice(usedStatIndex, 1); 
                }
            case 'Body Armor':
                statPool = ['Health %', 'Health', 'Defense %', 'Speed', 'Critical Chance %', 'Critical Damage %', 'Effectiveness', 'Effect Resistance'];
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    usedStatIndex = statPool.indexOf(stats[i].statType); 
                    statPool.splice(usedStatIndex, 1); 
                }
            case 'Necklace':case 'Ring':case 'Boot':
                statPool = ['Attack %', 'Attack', 'Health %', 'Health', 'Defense %', 'Defense', 'Speed', 'Critical Chance %', 'Critical Damage %', 'Effectiveness', 'Effect Resistance'];
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    usedStatIndex = statPool.indexOf(stats[i].statType); 
                    statPool.splice(usedStatIndex, 1);
                }
        }
        return stats;
    }

    //Sets the overall gear score of the equipment to gearScore attribute.
    setGearScore() {
        //Calculated using the following rules:
        /*
        Score = Attack %
        + Defense %
        + Hp %
        + Effectiveness
        + Effect Resistance
        + Speed * (8/4)
        + Crit Damage * (8/7)
        + Crit Chance * (8/5)
        + Flat Attack * 3.46 / 39
        + Flat Defense * 4.99 / 31
        + Flat Hp * 3.09 / 174 
        */
        let gs = 0;
        let score;
        this.stats.forEach(stat => {
            switch(stat.statType) {
                case 'Attack %':case 'Health %':case 'Defense %':case 'Effectiveness':case 'Effect Resistance':
                score = stat.value
                break;
            case 'Critical Chance %':
                score = stat.value * (8/5)
                break;
            case 'Critical Damage %':
                score = stat.value * (8/7)
                break;
            case 'Speed':
                score = stat.value * (8/4)
                break;
            case 'Attack':
                score = stat.value *  3.46 / 39
                break;
            case 'Health':
                score = stat.value * 3.09 / 174
                break;
            case 'Defense':
                score = stat.value * 4.99 / 31
                break;
            }
            gs += score;
        })
        this.gearScore = Math.floor(gs)
    }

    getType() {
        return this.type;
    }

    getStats() {
        return this.stats;
    }

    displayStat(statPos) {
        //Display the stat for the given array index.
        let statID = 'stat' + statPos.toString()
        let statValID = statID + 'val'
        if (stats[statPos].statType.endsWith('%') || stats[statPos].statType.startsWith('Critical') || stats[statPos].statType.startsWith('Eff')) {
            document.getElementById(statID).innerHTML = stats[statPos].statType;
            document.getElementById(statValID).innerHTML = stats[statPos].value + '%';
        } else {
            document.getElementById(statID).innerHTML = stats[statPos].statType;
            document.getElementById(statValID).innerHTML = stats[statPos].value;
        }
    }
};

class Stat {
    //Create array of stat objects with stat type and value
    /* Ranges:
           Attack%/Defense %/Health %/Eff/Effect Resistance -> 4%-8%
           Critical Chance %                                 -> 3%-5%
           Critical Damage %                                 -> 4%-7%
           Speed                                             -> 2-4
           Attack                                            -> 25-50
           Health                                            -> 150-200
           Defense                                           -> 25-35
    */
    constructor(statPool){
        this.statType = statPool[Math.floor(Math.random() * statPool.length)];
        this.value = this.addValue(this.statType);
    }

    addValue(){
        //Return a random value within the range for the given statType
        let min;
        let max;
        switch(this.statType){
            case 'Attack %':case 'Health %':case 'Defense %':case 'Effectiveness':case 'Effect Resistance':
                min = 4;
                max = 8;
                break;
            case 'Critical Chance %':
                min = 3;
                max = 5;
                break;
            case 'Critical Damage %':
                min = 4;
                max = 7;
                break;
            case 'Speed':
                min = 2;
                max = 4;
                break;
            case 'Attack':
                min = 25;
                max = 50;
                break;
            case 'Health':
                min = 150;
                max = 200;
                break;
            case 'Defense':
                min = 25;
                max = 35;
                break;
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}


function craft(){
    //Generate a new Equipment object and display stats to HTML
    equip = new Equipment();
    stats = equip.getStats();
    //Display image of equipment type
    let equipImg = document.createElement("img");
    switch(equip.getType()){
        case 'Weapon':
            equipImg.src = "./static/images/weapon.png"
            break;
        case 'Helmet':
            equipImg.src = "./static/images/helmet.png"
            break;
        case 'Body Armor':
            equipImg.src = "./static/images/body_armor.png"
            break;
        case 'Necklace':
            equipImg.src = "./static/images/necklace.png"
            break;
        case 'Ring':
            equipImg.src = "./static/images/ring.png"
            break;
        case 'Boot':
            equipImg.src = "./static/images/boot.png"
            break;
    }
    document.getElementById('display_type').src = equipImg.src

    for (i=0; i<stats.length; i++) {
        equip.displayStat(i)
    }

    document.getElementById('typeEnhancement').innerHTML = '&nbsp;'
    document.getElementById('numEnhancement').innerHTML = 'Equipment has been enhanced 0 times.'
}

function enhance(){
    //Increases the value of a randomly chosen stat by its possible range of values.
    //Maximum number of enhances is 5.
    try {
        if (equip.numOfEnhance == 5) {
            document.getElementById('numEnhancement').innerHTML = 'This equipment is already at max enhancement! The gear score is: ' + equip.gearScore;
        } else {
            let randStat;
            randStat = Math.floor(Math.random() * 4)
            equip.stats[randStat].value += equip.stats[randStat].addValue()
            equip.numOfEnhance += 1
            equip.displayStat(randStat)
            document.getElementById('typeEnhancement').innerHTML = equip.stats[randStat].statType + ' has been enhanced.'
            if (equip.numOfEnhance == 5) {
                equip.setGearScore()
                document.getElementById('numEnhancement').innerHTML = 'Equipment is fully enhanced. The gear score is: ' + equip.gearScore
            } else {
            document.getElementById('numEnhancement').innerHTML = 'Equipment has been enhanced ' + equip.numOfEnhance.toString() + ' times.'
            }
        }
    } catch {
        console.log("Equipment has not been crafted yet.")
    }
}

//Grab the equipment data, convert it to JSON, and send it back to Python for storage.
function save() {
    //Prevent saving the same item ultiple times into database.
    try {
        if (equip.numOfEnhance == 5) {
            //Only save max upgraded equips
            if (!equip.saved) {
                //FetchAPI used to send the equip object data as a JSON object
                fetch('/crafting', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(equip)
                })
                    .then(response => console.log(response))
                    .then(data => {
                        console.log('Equipment data sent.');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                document.getElementById('typeEnhancement').innerHTML = 'The equipment has been saved!'
            } else {
                document.getElementById('typeEnhancement').innerHTML = 'Equip is already saved into database.'
            }
            equip.saved = true
        } else {
            document.getElementById('typeEnhancement').innerHTML = 'You can only save maxed equipment!'
        }
    } catch {
        document.getElementById('typeEnhancement').innerHTML = 'No equipment crafted yet!'
    }
}
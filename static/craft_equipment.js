class Equipment {
    constructor(rarity='epic') {
        let typePool = ['Weapon', 'Helmet', 'Body Armor', 'Necklace', 'Ring', 'Boot'];
        this.type = typePool[Math.floor(Math.random() * typePool.length)];
        this.rarity = rarity
        this.stats = this.initializeStats(this.rarity, this.type)
        this.numOfEnhance = 0
    }

    initializeStats(rarity, type){
        //Create the initial stats and returns the stats as an array of Stat objects
        let numStats = 4 //Assuming epic gear
        let stats = [];
        let statPool;
        let usedStatIndex;
        switch(type){
            case 'Weapon':
                statPool = ['Attack %', 'Health %', 'Health', 'Speed', 'Critical Chance %', 'Critical Damage %', 'Effectiveness', 'Effect Resistance'];
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    //Remove the used stat from possible stat pool
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
           Attack%/Defense %/Health %/eff/Effect Resistance -> 4%-8%
           Critical Chance %                                -> 3%-5%
           Critical Damage %                                -> 4%-7%
           Speed                                            -> 2-4
           Attack                                           -> 25-50
           Health                                           -> 150-200
           Defense                                          -> 25-35
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
    document.getElementById('display_type').innerHTML = equip.getType();

    for (i=0; i<stats.length; i++) {
        equip.displayStat(i)
    }
}

function enhance(){
    //Increases the value of a randomly chosen stat by its possible range of values.
    //Maximum number of enhances is 5.
    if (equip.numOfEnhance == 5) {
        document.getElementById('enhancement').innerHTML = 'This equipment is already at max enhancement!'
    } else {
        let randStat;
        randStat = Math.floor(Math.random() * 4)
        equip.stats[randStat].value += equip.stats[randStat].addValue()
        equip.numOfEnhance += 1
        equip.displayStat(randStat)
        document.getElementById('typeEnhancement').innerHTML = equip.stats[randStat].statType + ' has been enhanced.'
        document.getElementById('numEnhancement').innerHTML = 'Equipment has been enhanced ' + equip.numOfEnhance.toString() + ' times.'
    }

}

/*
equip = new Equipment();
console.log(equip.getType());
console.log(equip.getStats());
*/
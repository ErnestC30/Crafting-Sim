class Equipment {
    constructor(rarity='epic') {
        let type = ['weapon', 'helmet', 'body armor', 'necklace', 'ring', 'boot'];
        this.type = type[Math.floor(Math.random() * type.length)];
        this.rarity = rarity
        this.stats = this.initializeStats(this.rarity, this.type)
    }

    initializeStats(rarity, type){
        //Create the initial stats and returns the stats as an array of Stat objects
        let numStats = 4 //Assuming epic gear
        let stats = [];
        let statPool;
        let usedStatIndex;
        switch(type){
            case 'weapon':
                statPool = ['atk%', 'hp%', 'hp', 'spd', 'critc', 'critd', 'eff', 'effres'];
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    usedStatIndex = statPool.indexOf(stats[i].statType); //Remove the used stat from possible stat pool
                    statPool.splice(usedStatIndex, 1); 
                }
            case 'helmet':
                statPool = ['atk%', 'atk', 'hp%', 'def%', 'def', 'spd', 'critc', 'critd', 'eff', 'effres']; 
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    usedStatIndex = statPool.indexOf(stats[i].statType); //Remove the used stat from possible stat pool
                    statPool.splice(usedStatIndex, 1); 
                }
            case 'body armor':
                statPool = ['hp%', 'hp', 'def%', 'spd', 'critc', 'critd', 'eff', 'effres'];
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    usedStatIndex = statPool.indexOf(stats[i].statType); //Remove the used stat from possible stat pool
                    statPool.splice(usedStatIndex, 1); 
                }
            case 'necklace':case 'ring':case 'boot':
                statPool = ['atk%', 'atk', 'hp%', 'hp', 'def%', 'def', 'spd', 'critc', 'critd', 'eff', 'effres'];
                for(let i=0; i < numStats; i++){
                    stats[i] = new Stat(statPool);
                    usedStatIndex = statPool.indexOf(stats[i].statType); //Remove the used stat from possible stat pool
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
};

class Stat {
    //Create array of stat objects with stat type and value
    /* Ranges:
           atk%/def%/hp%/eff/effres -> 4%-8%
           critc                    -> 3%-5%
           critd                    -> 4%-7%
           spd                      -> 2-4
           atk                      -> 25-50
           hp                       -> 150-200
           def                      -> 25-35
    */
    constructor(statPool){
        this.statType = statPool[Math.floor(Math.random() * statPool.length)];
        this.value = this.addValue(this.statType);
    }

    addValue(statType){
        //Return a random value within the range for the given statType
        let min;
        let max;
        switch(statType){
            case 'atk%':case 'hp%':case 'def%':case 'eff':case 'effres':
                min = 4;
                max = 8;
                return Math.floor(Math.random() * (max - min + 1) + min);
            case 'critc':
                min = 3;
                max = 5;
                return Math.floor(Math.random() * (max - min + 1) + min);
            case 'critd':
                min = 4;
                max = 7;
                return Math.floor(Math.random() * (max - min + 1) + min);
            case 'spd':
                min = 2;
                max = 4;
                return Math.floor(Math.random() * (max - min + 1) + min);
            case 'atk':
                min = 25;
                max = 50;
                return Math.floor(Math.random() * (max - min + 1) + min);
            case 'hp':
                min = 150;
                max = 200;
                return Math.floor(Math.random() * (max - min + 1) + min);
            case 'def':
                min = 25;
                max = 35;
                return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }
}


function craft(){
    //Generate a new Equipment object and display to HTML
    equip = new Equipment();
    stats = equip.getStats();
    document.getElementById('display_type').innerHTML = equip.getType();

    for (i=0; i<stats.length; i++) {
        stat_id = 'stat' + i.toString()
        document.getElementById(stat_id).innerHTML = stats[i].statType + ' ----> ' + stats[i].value;
    }
}

/*
equip = new Equipment();
console.log(equip.getType());
console.log(equip.getStats());
*/
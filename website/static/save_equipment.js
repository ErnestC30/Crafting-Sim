//Grab the equipment data, convert it to JSON, and send it back to Python for storage.
function save(){
    //Prevent saving the same item ultiple times into database.
    try{
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
                document.getElementById('typeEnhancement').innerHTML = 'You can only save maxed equipment!'
            }
            equip.saved = true
        } else {
            document.getElementById('typeEnhancement').innerHTML = 'Equip is already saved into database.'
        }
    } catch {
        document.getElementById('typeEnhancement').innerHTML = 'No equipment crafted yet!'
    } 
}
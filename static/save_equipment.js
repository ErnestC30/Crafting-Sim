//Grab the equipment data, convert it to JSON, and send it back to Python for storage.
function save(){
    //Prevent saving the same item ultiple times into database.
    if (!equip.saved) {
        //Only save max upgraded equips
        if (equip.numOfEnhance == 5) { 
        //FetchAPI used to send data asynchronously 
            fetch('/crafting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(equip)
            })
                .then(response => console.log(response))
                .then(data => {
                    console.log('Data Sent.');
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
}
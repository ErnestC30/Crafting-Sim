//Sorts and updates the table by chosen column. col -> statType
function colSort(col, boardType) {
    //Sends to views.py a JSON object with property sortType for ordering database.
    fetch('/leaderboard/' + boardType, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'sortType': col
        })
    })
        .then(response => response.json())
        //Recieves a Response object from app.py containing an array of data from each row.
        .then(data => {
            //Change each HTML element to the new value.
            updateTable(data, 'leaderboardTable')
            console.log('Table sorted.');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function updateTable(data, tableID) {
    console.log(data)
    table = document.getElementById(tableID)
    for(i=0;i<data.length;i++){
        //For each object (row)... update HTML
        table.rows[i+1].setAttribute('id', data[i]['id'])
        table.rows[i+1].cells[0].innerHTML = data[i]['type']
        //If Else statements to convert 0 values to '-'
        table.rows[i+1].cells[1].innerHTML  = data[i]['atkP'] ? data[i]['atkP'] : '-'
        table.rows[i+1].cells[2].innerHTML  = data[i]['atkF'] ? data[i]['atkF'] : '-'
        table.rows[i+1].cells[3].innerHTML  = data[i]['defP'] ? data[i]['defP'] : '-'
        table.rows[i+1].cells[4].innerHTML  = data[i]['defF'] ? data[i]['defF'] : '-'
        table.rows[i+1].cells[5].innerHTML  = data[i]['hpP']  ? data[i]['hpP']  : '-'
        table.rows[i+1].cells[6].innerHTML  = data[i]['hpF']  ? data[i]['hpF']  : '-'
        table.rows[i+1].cells[7].innerHTML  = data[i]['criC'] ? data[i]['criC'] : '-'
        table.rows[i+1].cells[8].innerHTML  = data[i]['criD'] ? data[i]['criD'] : '-'
        table.rows[i+1].cells[9].innerHTML  = data[i]['spd']  ? data[i]['spd']  : '-'
        table.rows[i+1].cells[10].innerHTML = data[i]['eff']  ? data[i]['eff']  : '-'
        table.rows[i+1].cells[11].innerHTML = data[i]['effR'] ? data[i]['effR'] : '-'
        table.rows[i+1].cells[12].innerHTML = data[i]['gs']
        table.rows[i+1].cells[13].innerHTML = data[i]['name']
    }
}
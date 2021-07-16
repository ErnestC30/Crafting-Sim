storage = window.sessionStorage;

function colSort(col) {
    //Sorts and updates the table by chosen column. col -> statType

    //Tracks whether the table should sort by descending or ascending value for given col.
    if(col in sessionStorage) {
        //descending -> largest value at top, ascending -> largest value at bottom
        if (sessionStorage.getItem(col) == 'des') {
            sessionStorage.setItem(col, 'asc');
        } else {
            sessionStorage.setItem(col, 'des');
        }
    } else {
        sessionStorage.setItem(col, 'des');
    }

    //Sends to app.py a JSON object with properties sortType and sortBy for ordering database.
    fetch('/crafts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sortType: col,
                              sortBy: sessionStorage.getItem(col)
                            })
    })   
        .then(response => response.json())
        //Recieves a Response object from app.py containing an array of data from each row.
        .then(data => {
            //Change each HTML element to the new value.
            updateTable(data, 'craftTable')
            console.log('Data sent to app.py');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//Updates the HTML table with the given data
function updateTable(data, tableID) {
    table = document.getElementById(tableID)
    for(i=0;i<data.length;i++){
        //For each object (row)... update HTML
        table.rows[i+1].cells[0].innerHTML = data[i]['type']
        table.rows[i+1].cells[1].innerHTML = data[i]['atkP']
        table.rows[i+1].cells[2].innerHTML = data[i]['atkF']
        table.rows[i+1].cells[3].innerHTML = data[i]['defP']
        table.rows[i+1].cells[4].innerHTML = data[i]['defF']
        table.rows[i+1].cells[5].innerHTML = data[i]['hpP']
        table.rows[i+1].cells[6].innerHTML = data[i]['hpF']
        table.rows[i+1].cells[7].innerHTML = data[i]['criC']
        table.rows[i+1].cells[8].innerHTML = data[i]['criD']
        table.rows[i+1].cells[9].innerHTML = data[i]['spd']
        table.rows[i+1].cells[10].innerHTML = data[i]['eff']
        table.rows[i+1].cells[11].innerHTML = data[i]['effR']
    }
}
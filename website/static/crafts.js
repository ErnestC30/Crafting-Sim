storage = window.sessionStorage;
//On refresh/reopen browser then table is not sorted.
window.onunload = function() {
    sessionStorage.removeItem('isSorted');
}

//Sorts and updates the table by chosen column. col -> statType
function colSort(col) {
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
    sessionStorage.setItem('isSorted', true)
    sessionStorage.setItem('lastType', col)

    //Sends to views.py a JSON object with properties methods, sortType, and sortBy for ordering database.
    fetch('/crafts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'methods': ['sort'],
            'sortType': col,
            'sortBy': sessionStorage.getItem(col)
        })
    })
        .then(response => response.json())
        //Recieves a Response object from app.py containing an array of data from each row.
        .then(data => {
            //Change each HTML element to the new value.
            updateTable(data, 'craftTable')
            console.log('Table sorted.');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//Remove equipment with given rowID from HTML and database 
function remove(rowID){
    let confirm = window.confirm('Delete Item?')
    if(confirm){
        //Retain current sort in the HTML table if it is already sorted.
        if (sessionStorage.getItem('isSorted')) {
            methods = ['remove', 'sort']
        } else {
            methods = ['remove']
        }

        fetch('/crafts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'methods': methods,
                'rowToDelete': rowID,
                'sortType': sessionStorage.getItem('lastType'),
                'sortBy': sessionStorage.getItem(sessionStorage.getItem('lastType'))
            })
        })
            .then(response => response.json())
            //Recieves a Response object from app.py containing an array of data from each row.
            .then(data => {
                //Change each HTML element to the new value.
                updateTable(data, 'craftTable', 'delete')
                console.log('Row removed.');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        console.log('Deletion canceled.')
    }
}

//Updates the HTML table with the given data
function updateTable(data, tableID, deleteRow='no') {
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
        //Tracks the equipment ID for the row.
        rowID = "remove('" + data[i]['id'] + "')" 
        table.rows[i+1].cells[13].firstChild.setAttribute('onclick', rowID)
    }
    //Removes the empty row if an item is deleted
    if(deleteRow == 'delete'){
        document.getElementById(tableID).deleteRow(table.rows.length - 1);
    }
}
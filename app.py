from flask import Flask, redirect, url_for, render_template, jsonify, request

#Use bootstrap to handle CSS/JS part?, SQLAlchemy for database, AJAX/JQuery for update info?

app = Flask(__name__)

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
        #ADD ABILITY TO STORE THE STATS + EQUIP TYPE INTO A DATABASE
        return 'OK', 200
    else:
        return render_template("crafting.html")
    
@app.route('/crafts')
def crafts():
    return render_template("crafts.html")

if __name__ == "__main__":
    app.run(debug=True)
    
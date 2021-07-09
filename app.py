from flask import Flask, redirect, url_for, render_template

#Use bootstrap to handle CSS/JS part?, SQLAlchemy for database, AJAX/JQuery for update info?

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def home():
    return render_template("home.html")

@app.route('/crafting')
def crafting():
    return render_template("crafting.html")
    

@app.route('/crafts')
def crafts():
    return render_template("crafts.html")


if __name__ == "__main__":
    app.run(debug=True)
    
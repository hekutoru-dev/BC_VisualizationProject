from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo



# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/Project")


# Route to render index.html template using data from Mongo

@app.route("/")
def home():
    return render_template("index.html")
    
@app.route("/data")
def stock():
        #print("Municipality")
        #municipality = input()
        #municipality = str(municipality)

        municipality =["Alvaro Obregon", "Azcapotzalco", "Benito Juarez", "Coyoacan", "Cuajimalpa de Morelos",\
             "Cuauhtemoc", "Gustavo A Madero", "Iztacalco", "Iztapalapa", "Miguel Hidalgo", "Milpa Alta",\
             "Tlalpan", "Venustiano Carranza", "Xochimilco"]

        jsDate=[]
        jsMunicipality=[]
        jsCO=[]
        jsNO=[]
        jsNO2=[]
        jsNOX=[]
        jsO3=[]
        jsPM10=[]
        jsPM25=[]
        jsPMCO=[]
        jsSO2=[]


        #ao = mongo.db.pollutants.find().sort("month_and_year")
        ao = mongo.db.pollutants.find({'Municipality' : 'Alvaro Obregon'}).sort("date_woh")

        for i in ao:
                jsDate.append(i["date_woh"])
                jsMunicipality.append(i["Municipality"])
                jsCO.append(i["CO"])
                jsNO.append(i["NO"])
                jsNO2.append(i["NO2"])
                jsNOX.append(i["NOX"])
                jsO3.append(i["O3"])
                jsPM10.append(i["PM10"])
                jsPM25.append(i["PM25"])
                jsPMCO.append(i["PMCO"])
                jsSO2.append(i["SO2"])
                

        trace = {
                "Date":jsDate,
                "Municipality":jsMunicipality,
                "CO":jsCO,
                "N02":jsNO2,
                "PM10":jsPM10
        }

        return jsonify(trace)


        #return render_template("stock.html", transformed=jsonarray)
        #return jsonify(jsonarray)
        #return jsonify(trace)


if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask import request
import json
import pandas as pd
from flask import jsonify


# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
# mongo = PyMongo(app, uri="mongodb://localhost:27017/Project")
connectionString = "mongodb://dbAdmin:Vol8e3v5XLGYrwTK@cluster0-shard-00-00-0dend.mongodb.net:27017,cluster0-shard-00-01-0dend.mongodb.net:27017,cluster0-shard-00-02-0dend.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
dbClient = MongoClient(connectionString)
db = dbClient["cdmx_pollution"]

# -------------------------------
# | Routes to render HTML files |
# -------------------------------
@app.route("/")
def home():
    return render_template("index.html")
@app.route("/data")
def data():
    return render_template("data.html")
@app.route("/overview")
def overview():
    return render_template("overview.html")
@app.route("/map")
def map():
    return render_template("heatmap.html")
@app.route("/plots")
def plots():
    return render_template("plots.html")
@app.route("/stations")
def stations():
    return render_template("map.html")
   
@app.route("/contaminants/")
def data1():
        _args = verifyQueryParameters(request.args)
        docs = getContaminants(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getContaminants(match, project = {}, skip = 0, limit = 1000, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.contaminants2016.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs


# -----------------
@app.route("/emergencies/")
def data2():
        _args = verifyQueryParameters(request.args)
        docs = getEmergencies(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getEmergencies(match, project = {}, skip = 0, limit = 1000, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.respiratorias2016.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs
# -----------------



# -----------------
@app.route("/municipality/")
def data3():
        _args = verifyQueryParameters(request.args)
        docs = getMunicipality(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getMunicipality(match, project = {}, skip = 0, limit = 100, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.daily_pollutants.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs
# ------------------------

# -----------------
@app.route("/municipality_and_emergencies/")
def data4():
        _args = verifyQueryParameters(request.args)
        docs = getMunAndEmer(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getMunAndEmer(match, project = {}, skip = 0, limit = 100, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.all_data.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs
# ------------------------




def verifyQueryParameters(args):
    _args = { }
    parametersAllowed = [
        'q',
        'project',
        'skip',
        'limit',
        'orient'
    ]
    if args.get('q'):
        qDict = json.loads(args.get('q'))
        if len(qDict) == 0:
            raise Exception("q parameter can't be empty")
        _args['match'] = qDict

    
    if args.get('project'):
        _args['project'] = json.loads(args.get('project'))
    
    if args.get('skip'):
        _args['skip'] = json.loads(args.get('skip'))

    if args.get('limit'):
        _args['limit'] = json.loads(args.get('limit'))

    if args.get('orient'):
        _args['orient'] = json.loads(args.get('orient'))
    else:
        _args['orient'] = 'records'

    return _args

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

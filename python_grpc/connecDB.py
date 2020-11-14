from pymongo import MongoClient

#connection to database
clientM = MongoClient('18.191.247.101:27017')   #se conectara al servicio que se llama mongo
db = clientM['proyecto2-g5']
cases = db['case']

#insert element for add mores objects use insert_many with list of python
def insertNote (objeto):
    try:
        cases.insert_one(objeto)
        return 200
    except:
        return 500   

def getCases ():
    return cases.find({})
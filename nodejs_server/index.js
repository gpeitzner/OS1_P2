const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var redis = require("redis");
var express = require('express')
var client = redis.createClient(6379, '18.222.232.8');
var app = express()
var cors = require('cors');

 
// Connection URL
const url = 'mongodb://18.191.247.101:27017';
 
// Database Name
const dbName = 'proyecto2-g5';
 

const PrimerReporte = function(db, callback){
  const collection = db.collection('case');
  collection.aggregate([
    {"$group":{_id:"$location", count:{$sum:1}}}
  ]).sort({count:-1}).limit(3).toArray(function(err, docs){
    console.log(docs);
    callback(docs);
  });
}

//{ $cond: [{$and:[ {$gte:["$age",18]}, {$lt:["$age", 25]}]}, "18 - 24", ""]},
const CuartoReporte = function(db, callback){
  const collection = db.collection('case');
  collection.aggregate([
    {
        "$group": {
            "_id": {
                "$concat": [
                    { "$cond": [ { "$and": [ { "$gt":  [{$toInt:"$age"}, 0 ] }, { "$lt": [{$toInt:"$age"}, 10] } ]}, "0 - 10", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 10] }, { "$lt": [{$toInt:"$age"}, 21] } ]}, "10 - 20", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 21] }, { "$lt": [{$toInt:"$age"}, 31] } ]}, "20 - 30", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 31] }, { "$lt": [{$toInt:"$age"}, 41] } ]}, "30 - 40", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 41] }, { "$lt": [{$toInt:"$age"}, 51] } ]}, "40 - 50", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 51] }, { "$lt": [{$toInt:"$age"}, 61] } ]}, "50 - 60", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 61] }, { "$lt": [{$toInt:"$age"}, 71] } ]}, "60 - 70", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 71] }, { "$lt": [{$toInt:"$age"}, 81] } ]}, "70 - 80", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 81] }, { "$lt": [{$toInt:"$age"}, 91] } ]}, "80 - 90", ""] },
                    { "$cond": [ { "$and": [ { "$gte": [{$toInt:"$age"}, 91] }, { "$lt": [{$toInt:"$age"}, 101] } ]}, "90 - 100", ""] },
                ]
            },
            "personas": { "$sum": 1 }
        }
    },
  ]).toArray(function(err, docs){
    console.log(docs);
    callback(docs);
  });
}

const SegundoReporte = function(db, callback){
  const collection = db.collection('case');
  collection.aggregate([
    {"$group":{_id:"$location", count:{$sum:1}}}
  ]).sort({count:-1}).toArray(function(err, docs){
    console.log(docs);
    callback(docs);
  });
}

// // Use connect method to connect to the server

// app.use(function (req, res, next) { 
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', true); 
//   next(); 
// });

app.use(cors());

app.listen(8081, function () {
  console.log('CORS-enabled web server listening on port 8081')
});


//Define request response in root URL (/)
app.get('/', function (req, res, next) {
  try{
    client.on("connect", function() {
      console.log("You are now connected");
    });
    client.lrange("casos", 0, 0, function(err, reply) {
      console.log(reply);
      res.send(JSON.parse(reply));
      // res.send("hola amigos");
    });
  }catch(err){
    res.send("Empty")
  }
});

app.get('/segundo', function(req, res, next){
  MongoClient.connect(url, function(err, client) {
    // assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    SegundoReporte(db, function(docs){
      if(docs){
        client.close();
        res.send(docs);
      }
    });
  });
});

app.get('/primero', function(req, res, next){
  MongoClient.connect(url, function(err, client) {
    // assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    PrimerReporte(db, function(docs){
      if(docs){
        client.close();
        res.send(docs);
      }
    });
  });
});

app.get('/cuarto', function(req, res, next){
  MongoClient.connect(url, function(err, client) {
    // assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    CuartoReporte(db, function(docs){
      if(docs){
        client.close();
        res.send(docs);
      }
    });
  });
});
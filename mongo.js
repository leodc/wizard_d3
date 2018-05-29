var db = require('./db');

var getGraphs = function(datasetId, callback){
    mongoClient.connect(mongoUrl, function(err, db) {
        if( err ) {
            console.error("Error connecting to mongo", datasetId, err);
            callback(false);
        }
            
        var dashCollection = db.collection(datasetId + ".dashboard");
        dashCollection.find({type:{$exists: true}}).sort({_id:1}).toArray(function(err, result){
            db.close();
            if( err ){
                console.error("Error getting the graphs", datasetId, err);
                callback(null);
            }
            
            console.log("finded graphs", datasetId, result);
            callback(result);
        });
    });
};


var postGraph = function(datasetId, graph, callback){
    mongoClient.connect(mongoUrl, function(err, db) {
        if( err ) {
            console.error("Error connecting to mongo", datasetId, err);
            callback(false);
        }
            
        var dashCollection = db.collection(datasetId + ".dashboard");
        dashCollection.insert(graph, function(err, result){
            if( err ) {
                console.error("Error posting the graph", datasetId, err);
                callback(false);
            }
            
            db.close();
            callback(result);
        });
    });
};


var getDatasetProperties = function(datasetId, callback){
    mongoClient.connect(mongoUrl, function(err, db) {
        if( err ) return console.error("Error connecting to mongo", err);
        
        var dashCollection = db.collection(datasetId + ".dashboard");
        dashCollection.findOne({properties: true}, function(err, result){
            if( err ) return console.error("Error getting properties", datasetId, err);
            
            db.close();
            callback(result);
        });
    });
};


var getDataset = function(datasetId, callback) {
    mongoClient.connect(mongoUrl, function(err, db) {
        if( err ) return console.error("Error connecting to mongo", err);
        
        var dataCollection = db.collection(datasetId + ".data");
        dataCollection.find({}).toArray(function(err, docs){
            if( err ) return console.error("Error getting the data", datasetId, err);
            
            db.close();
            callback(docs);
        });
    });
};


var insertData = function(originalName, fileName, data, callback) {
    getConnection().then(function(db){
        var dataCollection = db.collection(fileName + ".data");
        
        dataCollection.insertMany(data).then(function(data){
            var dashCollection = db.collection(fileName + ".dashboard");
            
            var dash = {
                datasetName: originalName,
                properties: true,
                documentSchema: getDocumentTypes(data[0])
            };
            
            dashCollection.insert(dash).then(function(result){
                console.log("Inserted documents and properties", data.length);
                
                db.close();
            });
            
        }, callback);
    }, callback);
};


var updateDatasetName = function(datasetId, title, callback){
    mongoClient.connect(mongoUrl, function(err, db) {
        if( err ) {
            console.error("Error connecting to mongo", datasetId, err);
            callback(null);
        }
            
        var dashCollection = db.collection(datasetId + ".dashboard");
        dashCollection.update({properties: true}, {$set: {datasetName: title}}, function(err, result){
            db.close();
            if( err ) {
                console.error("Error getting properties", datasetId, err);
                callback(null);
            }
            
            callback(result);
        });
    });
};


var updateGraph = function(datasetId, chartId, title, callback){
    mongoClient.connect(mongoUrl, function(err, db) {
        if( err ) {
            console.error("Error connecting to mongo", datasetId, err);
            callback(null);
        }
            
        var dashCollection = db.collection("data");
        dashCollection.update({_id: chartId}, {$set: {title: title}}, function(err, result){
            db.close();
            if( err ) {
                console.error("Error getting properties", datasetId, err);
                callback(null);
            }
            
            callback(result);
        });
    });
};




function handleError(err){
    console.log("error", err);
}


module.exports = {
    insertData: insertData,
    getDataset: getDataset,
    getDatasetProperties: getDatasetProperties,
    postGraph: postGraph,
    getGraphs: getGraphs,
    updateGraph: updateGraph,
    updateDatasetName: updateDatasetName
};
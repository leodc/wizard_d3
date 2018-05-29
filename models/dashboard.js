var db = require('../db');

exports.getGraphs = function(datasetId, callback){
    var dashCollection = db.get().collection(datasetId + ".dashboard");
    dashCollection.find({type:{$exists: true}}).sort({_id:1}).toArray(callback);
};


exports.insertGraph = function(datasetId, graph, callback){
    var dashCollection = db.get().collection(datasetId + ".dashboard");
    dashCollection.insert(graph, callback);
};


exports.getDatasetProperties = function(datasetId, callback){
    var dashCollection = db.get().collection(datasetId + ".dashboard");
    dashCollection.findOne({properties: true}, callback);
};


exports.insertDatasetProperties = function(datasetId, originalName, top, callback) {
    var dashCollection = db.get().collection(datasetId + ".dashboard");
    
    var dash = {
        datasetName: originalName,
        properties: true,
        documentSchema: getDocumentTypes(top)
    };
    
    dashCollection.insertOne(dash, {}, callback);
};


exports.updateDatasetName = function(datasetId, title, callback){
    var dashCollection = db.get().collection(datasetId + ".dashboard");
    dashCollection.update({properties: true}, {$set: {datasetName: title}}, callback);
};


exports.updateGraph = function(datasetId, chartId, title, callback){
    var dashCollection = db.get().collection(datasetId + ".dashboard");
    dashCollection.update({_id: chartId}, {$set: {title: title}}, callback);
};


function getDocumentTypes(data){
    var types = {
        coords: [],
        dates: [],
        numbers: [],
        strings: []
    };
	
	var coordsDic = ["latitude", "longitude", "lat", "lon", "lng"];
	var dateDic = /(date|time|fecha)+/i;
	for( var key in data ){
		if( key === "_id") continue;
		
		if( coordsDic.indexOf(key.toLowerCase()) > -1 && Number(data[key]) ){
			types.coords.push(key);
		} else if( dateDic.test(key) && Date.parse(data[key]) ){
			types.dates.push(key);
		} else if( Number(data[key]) ){
			types.numbers.push(key);
		} else if( Date.parse(data[key]) ){
			types.dates.push(key);
		} else {
			types.strings.push(key);
		}
	}
	
	return types;
}
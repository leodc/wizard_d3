var db = require('../db');

exports.get = function(datasetId, callback) {
    var dataCollection = db.get().collection(datasetId + ".data");
    dataCollection.find({}).toArray(callback);
};


exports.insertData = function(datasetId, data, callback) {
    var dataCollection = db.get().collection(datasetId + ".data");
    dataCollection.insertMany(data, callback);
};

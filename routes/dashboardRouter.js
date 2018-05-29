var express = require('express');
var router = express.Router();

var dashboard = require("../models/dashboard");


// dashboard home 
router.get('/:dataset', function(req, res) {
    var datasetId = req.params.dataset;
    
    dashboard.getDatasetProperties(datasetId, function(err, result){
        var template = err ? "notFound":"dashboard";
        if(result){
            result.datasetId = datasetId;
        }
        
        res.render(template, result);
    });
});


// dataset patch
router.patch('/:dataset', function(req, res) {
    console.log("updating title", req.body, req.params);
    
    var datasetId = req.params.dataset;
    var name = req.body.name;
    var chartId = req.body.pk;
    var title = req.body.value;
    
    if( name === "originalName" ){
        dashboard.updateDatasetName(datasetId, title, function(err, result){
            var status = result ? 200:400;
            res.status(status).end();
        });
    }else{
        dashboard.updateGraph(datasetId, chartId, title, function(err, result){
            var status = result ? 200:400;
            res.status(status).end();
        });
    }
});


module.exports = router;
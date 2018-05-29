var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: '.data/' });

var parse = require('csv-parse');
var fs = require('fs');

var dashboard = require("../models/dashboard");
var dataset = require("../models/dataset");


function respond(res, err, errorStatus, errorText){
    console.log(err);
    res.status(errorStatus).send(errorText);
}

function handleUpload(req, res, next){
    var datasetId = req.file.filename;
    
    console.log("handling upload", datasetId);
    fs.readFile('.data/' + datasetId, 'utf8', function (err, rawData) {
        if (err) return respond(res, err, 500, "Error interno, por favor intentalo más tarde.");

        var parseOptions = {
            comments: "#",
            columns: true,
            auto_parse: true,
            auto_parse_date: true
        };
        
        parse(rawData, parseOptions, function(err, data){
            if(err) return respond(res, err, 400, "Hubo un error al cargar el archivo, verifique que tenga el formato correcto.");
            
            var datasetName = req.file.originalname;
            
            datasetName = datasetName.endsWith(".csv") ? datasetName.substring(0, datasetName.length - 4):datasetName;
            
            dataset.insertData(datasetId, data, function(err, docs){
                if(err) return respond(res, err, 500, "Error interno, por favor intentalo más tarde."); // To do: rollback
                
                dashboard.insertDatasetProperties(datasetId, datasetName, data[0], function(err, docs){
                    if(err) return respond(res, err, 500, "Error interno, por favor intentalo más tarde."); // To do: rollback
                    
                    fs.unlink('.data/' + datasetId, function(err){
                        if(err) console.error("Can't delete the file", datasetId, err);
                    });
                    
                    console.log("saved correctly", datasetId);
                    res.status(200).send(datasetId);
                });
            });
        });
    });
}


// uploader
router.post('/upload', upload.single('userData'), handleUpload);


// index
router.get('/', function(req, res) {
    res.render('index');
});


module.exports = router;

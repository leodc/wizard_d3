// Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var bodyParser = require("body-parser");
var io = require('socket.io')(http);
var db = require('./db');
var dataset = require('./models/dataset');
var dashboard = require('./models/dashboard');


// setup
app.use(express.static(path.join(__dirname, 'client')));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 33333);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// routers
var indexRouter = require("./routes/router.js");
var dashboardRouter = require("./routes/dashboardRouter.js");

app.use("/data/", dashboardRouter);
app.use("/", indexRouter);


// client sockets
io.of('/dataset').on('connection', datasetSocket);


// start
db.connect('mongodb://localhost:27017/wizard', function(err) {
    if (err) {
        console.log('Unable to connect to Mongo');
        process.exit(1);
    }
    
    http.listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
});



function datasetSocket(socket){
    socket.on("getDataset", function(datasetId){
        dataset.get(datasetId, function(err, docs){
            if(err) console.error("Error getting the data");
            
            socket.emit("dataset", docs);
        });
    });
    
    
    socket.on("getGraphs", function(datasetId){
        dashboard.getGraphs(datasetId, function(err, docs){
            if(err) console.error("Error getting the graphs", err);
            
            socket.emit("graphs", docs);
        }); 
    });
    
    
    socket.on("postGraph", function(req){
        dashboard.insertGraph(req.datasetId, req.graph, function(err, docs){
            if(err) console.log("Error inserting graph");
            
            socket.emit("postedGraph", req.graph);
        });
    });
}

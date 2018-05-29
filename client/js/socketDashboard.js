var socket = io(window.location.origin + "/dataset");

window.getDataset = function(){
    console.log("requesting dataset");
    socket.emit("getDataset", window.datasetId);
};


window.getGraphs = function(){
    console.log("requesting graphs");
    socket.emit("getGraphs", window.datasetId);
};


window.postGraph = function(graph){
    console.log("posting graphs");
    socket.emit("postGraph", {datasetId: window.datasetId, graph: graph});
};


socket.on("graphs", function(graphs){
    console.log("painting graphs", graphs.length);
	for( var i = 0; i < graphs.length; i++ ){
		window.addGraph(graphs[i].type, graphs[i]);
	}
});

socket.on("dataset", function(data){
    window.initDashboard(data);
});

socket.on("postedGraph", function(graph){
    window.addGraph(graph.type, graph);
});


/*global io*/
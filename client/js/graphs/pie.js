window.buildPieChart = function(ndx, type, data){
    if( data ) return paintPie(ndx, data.key, data.title);
    
    var key = $("#pie-value").val();
    
    var graph = {
        _id: Object.keys(window.charts).length,
        title: key,
        key: key,
        type: type
    };
    
    window.postGraph(graph);
};


function paintPie(ndx, key, title){
    console.log("painting chart pie");
        
    var id = "dc-chart-pie-" + Math.random().toString(36).substring(7);
    
    window.addDiv(key, id, title, false);
    var chart = dc.pieChart("#" + id, 'chartgroup');
    
    var dimension = ndx.dimension(function (d) {
        return d[key];
    });
    var group = dimension.group();
    
    chart
        .width($("#"+id).width())
        .height(300)
        .slicesCap(20)
        .dimension(dimension)
        .title(function(d){return d[key];})
        .group(group)
        .minAngleForLabel(1.1)
        .drawPaths(true)
        .legend(dc.legend().legendText(function(d){
            var aux = (d.name.length > 20) ? d.name.substring(0,20).trim() + "...":d.name;
            return aux;
        }))
        .render();
    
    window.charts[id] = chart;
    
    return;
}

/* global dc $*/
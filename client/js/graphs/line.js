window.buildLineChart = function(ndx, type, data){
    if ( data ) return paintLine(ndx, data.key, data.title);
    
    var key = $("#line-value").val();
    
    var graph = {
        _id: Object.keys(window.charts).length,
        title: key,
        key: key,
        type: type
    };
    
    window.postGraph(graph);
}

function paintLine(ndx, key, title){
    console.log("building line chart", key);
    
    var id = "dc-chart-line-" + Math.random().toString(36).substring(7);
    
    window.addDiv(key, id, title, false);
    var chart = dc.lineChart("#" + id, 'chartgroup');
    
    var dimension = ndx.dimension(function (d) {
        return d[key];
    });
    
    var group = dimension.group();
    
    var min = Math.floor(dimension.bottom(1)[0][key]);
    
    var dimensionDomain = [
        min,
        Math.ceil(dimension.top(1)[0][key])
    ];
    
    chart
        .width($("#"+id).width())
        .height(300)
        .dimension(dimension)
        .group(group)
        .title(function(d){return d[key];})
        .elasticX(true)
        .elasticY(true)
        .renderArea(true)
        .brushOn(false)
        .renderDataPoints(true)
        .clipPadding(10)
        .x(d3.scale.linear().domain(dimensionDomain).range([0,100]))
        .xAxis();
    
    chart.render();
    
};


/* global dc d3 $*/
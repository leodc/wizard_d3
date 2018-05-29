window.buildScatterChart = function(ndx, type, data){
    if ( data ) return paintScatter(ndx, data.x_key, data.y_key, data.title)
    
    var x_key = $("#lat-value").val();
    var y_key = $("#lng-value").val();
    
    var graph = {
        _id: Object.keys(window.charts).length,
        title: type,
        x_key: x_key,
        y_key: y_key,
        type: type
    };
    
    window.postGraph(graph);
}

function paintScatter(ndx, x_key, y_key, title){
    console.log("building scatter chart", x_key, y_key);
    
    var id = "dc-chart-scatter-" + Math.random().toString(36).substring(7);
    
    window.addDiv(x_key + "/" + y_key, id, title, true);
    var chart = dc.scatterPlot("#" + id, 'chartgroup');
    
    var dimension = ndx.dimension(function(d) { return [d[x_key], d[y_key]]; });
    var group = dimension.group();
    
    
    var x_dimension = ndx.dimension(function(d) { return d[x_key]; });
    var scatterXDimensionDomain = window.getValidDimension(Math.floor(x_dimension.bottom(1)[0][x_key]), Math.ceil(x_dimension.top(1)[0][x_key]));
    
    
    var y_dimension = ndx.dimension(function(d) { return d[y_key]; });
    var scatterYDimensionDomain = window.getValidDimension(Math.floor(y_dimension.bottom(1)[0][y_key]), Math.ceil(y_dimension.top(1)[0][y_key]));
    
    chart
        .width($("#" + id).width())
        .height(300)
        .x(d3.scale.linear().domain(scatterXDimensionDomain))
        .y(d3.scale.linear().domain(scatterYDimensionDomain))
        .yAxisLabel(x_key)
        .xAxisLabel(y_key)
        .dimension(dimension)
        //.excludedColor('#ddd')
        .group(group);
    
    chart.margins().left += 40;
    chart.render();
    
    window.charts[id] = chart;
};


/* global dc d3 $*/


window.buildBarChart = function(ndx, type, data){
    if( data ) return paintBar(ndx, data.key, data.title, data.fullRow);
    
    var key = $("#bar-value").val();
    
    var graph = {
        _id: Object.keys(window.charts).length,
        title: key,
        key: key,
        type: type,
        fullRow: document.getElementById('fullRowBar').checked
    };
    
    window.postGraph(graph);
};


function paintBar(ndx, key, title, fullRow){
    console.log("painting bar chart");
    
    var id = "dc-chart-bar-" + Math.random().toString(36).substring(7);
    
    window.addDiv(key, id, title, fullRow);
    var chart = dc.barChart("#" + id, 'chartgroup');
    
    
    var dimension = ndx.dimension(function (d) { return d[key]; });
    var group = dimension.group();
    
    var dimensionDomain = window.getValidDimension(Math.floor(dimension.bottom(1)[0][key]), Math.ceil(dimension.top(1)[0][key]));
    
    chart
        .width($("#"+id).width())
        .height(300)
        .dimension(dimension)
        .group(group)
        .x(d3.scale.linear().domain(dimensionDomain))
    	.elasticY(true)
    	.xAxisLabel(key)
    	.round(dc.round.floor)
    	.alwaysUseRounding(true)
    	.renderHorizontalGridLines(true)
    	.centerBar(true)
    	.render();
    
    window.charts[id] = chart;
    return;
}


/* global dc d3 $*/
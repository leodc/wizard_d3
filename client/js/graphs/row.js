window.buildRowChart = function(ndx, type, data){
    if(data) return paintRow(ndx, data.key, data.title, data.fullRow);
    
    var key = $("#row-value").val();
    var graph = {
        _id: Object.keys(window.charts).length,
        title: key,
        key: key,
        type: type,
        fullRow: document.getElementById('fullRowRow').checked
    };
    
    window.postGraph(graph);
};


function paintRow(ndx, key, title, fullRow){
    console.log("painint row chart");
    
    var id = "dc-chart-row-" + Math.random().toString(36).substring(7);
    
    window.addDiv(key, id, title, fullRow);
    var chart = dc.rowChart("#" + id, 'chartgroup');
    
    var dimension = ndx.dimension(function (d) {
        return d[key];
    });
    var group = dimension.group();
    
    chart
        .width($("#"+id).width())
        .height(300)
        .dimension(dimension)
        .group(group)
        .renderTitleLabel(true)
        .title(function(d){return d[key];})
        .elasticX(true)
        .render();
        
    window.charts[id] = chart;
    return;
}


/* global dc $*/

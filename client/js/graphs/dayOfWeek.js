window.buildDayOfWeekChart = function(ndx, type, data){
    if ( data ) return paintDay(ndx, data.key, data.title);
    
    var key = $("#days-value").val();
    
    var graph = {
        _id: Object.keys(window.charts).length,
        title: key,
        key: key,
        type: type
    };
    
    window.postGraph(graph);
}

function paintDay(ndx, key, title){
    console.log("building row chart", key);
    
    var id = "dc-chart-row-day-" + Math.random().toString(36).substring(7);
    
    window.addDiv(key, id, title, false);
    var chart = dc.rowChart("#" + id, 'chartgroup');
    
    var dayOfWeek = ndx.dimension(function (d) {
        var day = new Date(d[key]).getDay();
        var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return day + '.' + name[day];
    });
    var dayOfWeekGroup = dayOfWeek.group();
    
    chart
        .width($("#"+id).width())
        .height(300)
        .group(dayOfWeekGroup)
        .dimension(dayOfWeek)
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .render();
        
    window.charts[id] = chart;
};


/* global dc $ d3*/

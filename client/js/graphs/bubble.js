window.buildBubbleChart = function(ndx, type, data){
    if( data ) return paintBubble(ndx, data.x_key, data.y_key, data.r_key, data.c_key, data.l_key, data.groupBy, data.title);
    
    var x_key = $("#bubble-x-value").val();
    var y_key = $("#bubble-y-value").val();
    var r_key = $("#bubble-radius-value").val();
    var c_key = $("#bubble-color-value").val();
    var l_key = $("#bubble-label-value").val();
    var groupBy = $("#bubble-group-value").val();
    
    var graph = {
        _id: Object.keys(window.charts).length,
        title: type,
        type: type,
        x_key: x_key,
        y_key: y_key,
        r_key: r_key,
        c_key: c_key,
        l_key: l_key,
        groupBy: groupBy
    };
    
    window.postGraph(graph);
}


function paintBubble(ndx, x_key, y_key, r_key, c_key, l_key, groupBy, title){
    console.log("building bubble chart", x_key, y_key, r_key, c_key, l_key);
    
    var id = "dc-chart-bubble-" + Math.random().toString(36).substring(7);
    
    window.addDiv(x_key + "/" + y_key, id, title, true);
    var chart = dc.bubbleChart("#" + id, 'chartgroup');
    var dimension = ndx.dimension(function(d){ return d[groupBy]});
    
    
    var group = dimension.group().reduce(
        function (p, v) {
            ++p.count;
            p[x_key + "_x"] += v[x_key];
            p[y_key + "_y"] += v[y_key];
            p[r_key + "_r"] += v[r_key];
            p[c_key + "_c"] += v[c_key];
		    
		    p.x_avg = getAvg(p[x_key + "_x"],p.count);
		    p.y_avg = getAvg(p[y_key + "_y"],p.count);
		    p.c_avg = getAvg(p[r_key + "_r"],p.count);
            
            return p;
        },
        function (p, v) {
            --p.count;
            p[x_key + "_x"] -= v[x_key];
            p[y_key + "_y"] -= v[y_key];
            p[r_key + "_r"] -= v[r_key];
            p[c_key + "_c"] -= v[c_key];
		    
		    p.x_avg = getAvg(p[x_key + "_x"],p.count);
		    p.y_avg = getAvg(p[y_key + "_y"],p.count);
		    p.c_avg = getAvg(p[r_key + "_r"],p.count);
		    
            return p;
        },
        function () {
            var obj = {
                count: 0,
                c_avg: 0,
                x_avg: 0,
                y_avg: 0
            };
            
            obj[x_key + "_x"] = 0;
            obj[y_key + "_y"] = 0;
            obj[r_key + "_r"] = 0;
            obj[c_key + "_c"] = 0;
            
            return obj;
        }
    );
    
    var radiusDimension = ndx.dimension(function(d){ return d[r_key]});
    var radiusDomain = [
        Math.floor(radiusDimension.bottom(1)[0][r_key]),
        Math.ceil(radiusDimension.top(1)[0][r_key])
    ];
    
    var colorDimension = ndx.dimension(function(d){ return d[c_key]});
    var colorDomain = [
        Math.floor(colorDimension.bottom(1)[0][c_key]),
        Math.ceil(colorDimension.top(1)[0][c_key])
    ];
    
    chart
        .width($("#" + id).width() + 50)
        .height(300)
        .clipPadding(100)
        .x(d3.scale.linear())
        .yAxisLabel(y_key)
        .xAxisLabel(x_key)
        .elasticY(true)
        .elasticX(true)
        .dimension(dimension)
        //.colors(colorbrewer.PuBu[9])
        //.colorDomain(radiusDomain)
        .keyAccessor(function (p) {return p.value.x_avg;})
        .valueAccessor(function (p) {return p.value.y_avg;})
        .radiusValueAccessor(function (p) {return (p.value[r_key + "_r"]*3/radiusDomain[1])-radiusDomain[0];})
        //.colorAccessor(function (d) {return d.value.c_avg;})
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .group(group)
        .sortBubbleSize(true)
        .render();
        
        
    window.charts[id] = chart;
};


function getAvg(total, count){
    if( count === 0 ) return 0;
    return total/count;
}

/* global dc d3 $ colorbrewer*/


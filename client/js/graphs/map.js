window.buildMap = function(ndx, type, data){
    if ( data ) return paintMap(ndx, data.lat_key, data.lng_key, data.title);
    
    var lat_key = $("#scatter-x-value").val();
    var lng_key = $("#scatter-y-value").val();
    
    var graph = {
        _id: Object.keys(window.charts).length,
        title: type,
        lat_key: lat_key,
        lng_key: lng_key,
        type: type
    };
    
    window.postGraph(graph);
}

function paintMap(ndx, lat_key, lng_key, title){
    console.log("building map", lat_key, lng_key);

    var id = "dc-chart-map-" + Math.random().toString(36).substring(7);
    
    window.addDiv(lat_key + "," + lng_key, id, title, true, true);
    var chart = dc.leafletMarkerChart("#" + id + " .map", 'chartgroup');
    
    var facilities = ndx.dimension(function(d) { return [d[lat_key].toString() +","+ d[lng_key].toString()]; });
    var facilitiesGroup = facilities.group().reduceCount();
    
    $("#" + id + " .map").css("width", 600);
    $("#" + id + " .map").css("height", 600);
    
    chart
        .width($("#"+id).width())
        .height(300)
        .dimension(facilities)
      .group(facilitiesGroup)
      .width(600)
	    .height(400)
      .center([42.69,25.42])
      .zoom(7)
      .renderPopup(false)
      .filterByArea(true);  
    
    chart.render();
    dc.renderAll('chartgroup');
    window.charts[id] = chart;
};

/*global dc $*/
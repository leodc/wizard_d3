window.buildTable = function(ndx, selector){
    console.log("building table");
    
    var chart = dc.dataTable(selector, 'chartgroup');
    var counter = 0;
    var dimension = ndx.dimension(function (d) {
        return counter++;
    });
    
    var columns = [];
    for( var keyAux in dimension.top(1)[0] ){
        if( keyAux === "_id") continue;
        
        $(selector + " thead tr").append("<th>" + keyAux + "</th>");
        addColumnFunction(columns, keyAux);
    }
    
    chart
        .width($(selector).width())
        .size(Infinity)
        .dimension(dimension)
    	.group(function(d) { return 'chartgroup'})
        .columns(columns)
        .showGroups(false)
        .beginSlice(0);
        
    chart.render();
    
    window.updateTableSize = function(){
        if( Number($("#tableSize").val()) ){
            chart.endSlice(Number($("#tableSize").val())).render();
        }
    };
    
    window.updateTableSize();
    window.charts.dataTable = chart;
};

  
function addColumnFunction(columns, key){
    columns.push(function(d){ return d[key]});
}

/* global dc $*/
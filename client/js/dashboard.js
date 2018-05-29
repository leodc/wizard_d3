var ndx;

window.getValidDimension = function(floor, ceil){
    var dimensionDomain = [floor, ceil];
    
    if(floor === ceil){
        dimensionDomain[0] = (floor - 10 < 0) ? 0:floor - 10;
        dimensionDomain[1] = ceil + 10;
    }
    
    dimensionDomain[0] = (dimensionDomain[0] <= 10)? dimensionDomain[0]:0;
    
    return dimensionDomain;
};


window.addDiv = function(key, id, title, fullRow, map){
	var html = "";
	var columns = "10";
	var freeSpaceId = "freeChartSpace";
	var location = window.location.pathname;
	
	var order = Object.keys(window.charts).length;
	var chartTitle = "<a class='h4' id='title_" + id + "' data-type='text' data-pk='" + order + "' data-url='" + location +"' data-title='Nuevo título para la gráfica.'>" + title + "</a> <a class='reset' href='javascript:window.charts[\"" + id + "\"].filterAll();dc.redrawAll(\"chartgroup\");' style='display: none;'>reset</a>";
	if( !fullRow ){
		columns = "5";
	
		if ( $("#" + freeSpaceId).length ) {
		    $("#" + freeSpaceId).attr('id',   id);
		    $("#" + id).html(chartTitle);
		    $("#" + "title_" + id).editable({
		    	error: function(response, newValue) {
				    return "Ha ocurrido un error, por favor intente de nuevo más tarde.";
				}
		    });
		    return;
		}
	}
	
	html += "<div class='row'>";
	html += 	"<div class='col-sm-" + columns + " col-sm-offset-1 col-xs-12' id='" + id + "'>";
	html += 		chartTitle;
	
	if(map) html += "<div class='map'></div>";
	
	html += 	"</div>";
	
	if( !fullRow )
		html += 	"<div class='col-sm-5' id='" + freeSpaceId + "' col-xs-12></div>";
		
	html += "</div>";
	
	$("#graphsContainer").append(html);
	
	$("#" + "title_" + id).editable({
		error: function(response, newValue) {
		    console.log(response, newValue);
		}
	});
};


window.roundDecimals = function(numberString){
	if( Number(numberString) ){
        var aux = numberString.split(".");
        var decimals = (aux[1]) ? aux[1].substr(1, aux[0].length):"0";
        return Number( aux[0] + "." + decimals );
    }
    
    return numberString;
};



function buildOptions(){
	console.log("customizing options");
	
	var i;
	for( i = 0; i < window.dataNumbers.length; i++){
		$("#bar-value, #line-value, #bubble-x-value, #bubble-y-value, #bubble-radius-value, #scatter-x-value, #scatter-y-value, #bubble-color-value, #bubble-group-value").append($('<option>', {
		    value: window.dataNumbers[i],
		    text: window.dataNumbers[i]
		}));
	}
	
	for( i = 0; i < window.dataStrings.length; i++){
		$("#pie-value, #row-value, #bubble-label-value").append($('<option>', {
		    value: window.dataStrings[i],
		    text: window.dataStrings[i]
		}));
	}
	
	for( i = 0; i < window.dataDates.length; i++){
		$("#days-value").append($('<option>', {
		    value: window.dataDates[i],
		    text: window.dataDates[i]
		}));
	}
	
	for( i = 0; i < window.dataCoords.length; i++){
		$("#lat-value, #lng-value").append($('<option>', {
		    value: window.dataCoords[i],
		    text: window.dataCoords[i]
		}));
	}
	
	$(".selectpicker").selectpicker('refresh')
}


function updateCustomInputsView(){
	$(".custom-input").hide();
	
	var inputId = $('option:selected', $("#newChartType")).attr('input-div');
	$("#" + inputId).show();
}


window.addGraph = function(type, data){
	switch(type){
		case "bar":
			window.buildBarChart(ndx, type, data);
			break;
		case "pie":
			window.buildPieChart(ndx, type, data);
			break;
		case "row":
			window.buildRowChart(ndx, type, data);
			break;
		case "line":
			window.buildLineChart(ndx, type, data);
			break;
		case "map":
			window.buildMap(ndx, type, data);
			break;
		case "bubble":
			window.buildBubbleChart(ndx, type, data);
			break;
		case "scatter":
			window.buildScatterChart(ndx, type, data);
			break;
		case "days":
			window.buildDayOfWeekChart(ndx, type, data);
			break;
		default:
			break;
	}
};


window.initDashboard = function(data){
	if(data){
		$(".btn-primary").prop('disabled', false);
		
	    ndx = crossfilter(data);
	    
	    dc.dataCount(".dc-data-count", 'chartgroup').dimension(ndx).group(ndx.groupAll()).render();
	    window.buildTable(ndx, "#dc-table-graph");
		
		buildOptions();
		window.getGraphs();
	}else{
		console.log("errog getting the data", window.location.pathname);
	}
};


$(function(){
	// setup
	addButtonToNav("Nueva gráfica", "glyphicon-plus", null, "newGraphDialog");
	addButtonToNav("Descargar tabla", "glyphicon-floppy-save", "downloadTable");
	addButtonToNav("Descargar PDF", "glyphicon-save-file", "downloadPdf");
	addButtonToNav("Tipos de datos", "glyphicon-cog", null, "dataTypeDialog");
	
	$.fn.editable.defaults.ajaxOptions = {type: "PATCH"};
	window.charts = {};
	window.getDataset();
	
	$(".selectpicker").selectpicker({
		liveSearch: true
	});
	
	$("#originalName").editable({
		url: window.location.pathname
	});
	
	$('#dataPanel').lobiPanel({
        reload: false,
	    close: false,
	    editTitle: false,
	    maxWidth: 9000
    });
	
	$("#newChartType").change(function(){
		updateCustomInputsView();
	});
		
	$('#newGraphDialog').on('show.bs.modal', function (event) {
		updateCustomInputsView();
	});
	
	$("#addGraph").click(function(evt){
		window.addGraph($('#newChartType').val());
		/*
		var firstData, secondData, radiusValue, colorValue, labelValue, groupBy, lat, lng;
		switch(type){
			case "row":
				firstData = 
				window.buildRowChart(ndx, firstData);
				break;
			case "line":
				firstData = $("#line-value").val();
				window.buildLineChart(ndx, firstData);
				break;
			case "map":
				lat = $("#lat-value").val();
				lng = $("#lng-value").val();
				window.buildMap(ndx, lat, lng);
				break;
			case "bubble":
				firstData = $("#bubble-x-value").val();
				secondData = $("#bubble-y-value").val();
				radiusValue = $("#bubble-radius-value").val();
				colorValue = $("#bubble-color-value").val();
				labelValue = $("#bubble-label-value").val();
				groupBy = $("#bubble-group-value").val();
				
				window.buildBubbleChart(ndx, firstData, secondData, radiusValue, colorValue, labelValue, groupBy);
				break;
			case "scatter":
				firstData = $("#scatter-x-value").val();
				secondData = $("#scatter-y-value").val();
				
				window.buildScatterChart(ndx, firstData, secondData);
				break;
			case "days":
				firstData = $("#days-value").val();
				
				window.buildDayOfWeekChart(ndx, firstData);
				break;
			
			default:
				break;
		}
		*/
	});
});


window.donwloadPdf = function(){
	var svgData;
	for(var key in window.charts){
		if( key === "dataTable" ) continue;
		
		svgData = document.getElementById(key).toDataURL();
		console.log(svgData);
	}
	
	console.log(window.charts);
};


window.downloadTable = function(){
	var counter = 0;
    var dimension = ndx.dimension(function (d) {
        return counter++;
    });

	var data = dimension.top(Infinity);
    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
    
    var title = $("#originalName").html();
    title += title.endsWith(".csv") ? "":".csv";
    
    saveAs(blob, title);
};


/*
	resize window handler
*/
var rtime;
var timeout = false;
var delta = 200;
$(window).resize(function() {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
});

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        for( var chartId in window.charts ){
        	window.charts[chartId].width($("#" + chartId).width());
        }
        
        dc.renderAll("chartgroup");
    }
}

/*global $ crossfilter dc saveAs Blob d3 addButtonToNav*/
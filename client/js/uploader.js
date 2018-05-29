window.handleFiles = function(files){
    console.log("Processing files", files.length);
    $("#submitButton").attr("disabled", true);
    
    if( files.length === 1 ){
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            var preview = e.target.result.split(/\r\n|\n/).slice(0,5);
            
            var splitRule = ",";
            var headers = preview[0].split(splitRule);
            var sample = preview[1].split(splitRule);
            
            var html;
            if( headers.length !== sample.length ) {
                html = "Parece que hay un error en el formato de tus datos.<br>";
                html += "<br><strong>Header</strong><br>" + JSON.stringify(headers, null, 2);
                html += "<br><strong>First data row</strong><br>" + JSON.stringify(sample, null, 2);
            }else{
                var data = {};
                for( var i = 0; i < headers.length; i++){
                    data[headers[i]] = sample[i];
                }
                
                html = JSON.stringify(data, null, 2);
                
                $("#sendFile").attr("disabled", false);
            }
            
            $("#filePreview").html(html);
        };
        
        fileReader.readAsText(files[0]);
    }
};



$('#fileForm').ajaxForm({
    uploadProgress: function(event, position, total, percent){
        $("#fileBarProgress .progress-bar").css("width", percent + "%");
        $("#fileBarProgress .progress-bar").html(percent + "%");
    },
    success: function(resp){
        window.location.href = "/data/" + resp;
    },
    error: function(resp){
        console.log("error", resp);
        $("#fileBarProgress .progress-bar").css("width", "0%");
    }
});


/*
$("#fileForm").submit(function(e){
    //e.preventDefault();
    console.log("asdad")
    
    
    return false;
});*/

/* global $ */
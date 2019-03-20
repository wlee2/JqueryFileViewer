/*$.get("/data", function(data, status){
  console.log(data);
  alert("Data: " + data + "\nStatus: " + status);
});*/

//$("#demo").load("censortext.js"); <!-- load data from local file -->

$(".btn").off().on('click', function(){
	$("#demo").animate({width: 'toggle'});
});

$(document).off().on('click','ul li', function(){
  $("#demo").css({width: '0%'}, 0);
  $("li").removeClass("pick");
  $(this).addClass("pick"); 
  var fileName = $(this).text().trim();
  console.log(fileName);
  if(fileName.indexOf(".pdf") > 0){
    window.open(window.location.href + fileName, '_blank')
  }
  else if(fileName.indexOf(".docx") > 0){
    alert('https://docs.google.com/gview?url=' + window.location.href + fileName);
    window.open('https://docs.google.com/gview?url=' + window.location.href + fileName, '_blank');

  }
  else if(fileName.indexOf(".") < 2){
    if($("div").hasClass(fileName)){
        console.log("yes");
        $("div[class*='" + fileName + "']").remove();    
    }
    else {
      var txt;
      $.get("/data", {filename: fileName}, function(datas, status){
        console.log(datas);
        txt = '<div class="' + fileName + ' printed">';
        datas.forEach(function(data){
          txt += '<ul id="' + data + '"><li onclick="">' + data + '</li></ul>';
        });
        txt += '</div>';
        $(document.getElementById(fileName)).after(txt);
      });
    } 
    
  }
  else {  
    $("#demo").load(fileName, function(responseTxt, statusTxt, xhr) {
      var string = responseTxt;
      string = string.replace(/>/g, "&gt;");
      string = string.replace(/</g, "&lt;");

    $("#demo").html(PR.prettyPrintOne(string, 'js', true));
    // $("#demo").slideDown("slow");
    $("#demo").animate({width: '100%'}, 2000);
    });
  }
  /*$.ajax({
    url: fileName,
    type: 'GET',
    processData: false,
    contentType: false,
    success: function(data){
        $("#demo").text(data);
        $("#demo").addClass("prettyprint lang-js linenums");
        $("#demo").slideDown("slow");
      }
    });*/


 /* $.ajax({
    url: fileName,
    success: function(result){
      $("#demo").text(result);
      $("#demo").slideDown("slow");
    }
  });*/
});


$('.upload-btn').on('change', function (){
	$('.progress-bar').text('0%');
	$('.progress-bar').width('0%');

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          alert('upload successful!\n');
          location.reload();
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').text('Done');
            }
          }
        }, false);
        return xhr;
      }
    });
  }
});
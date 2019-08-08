// notification radio
var backgroundPage = browser.extension.getBackgroundPage();

// version
var version = document.getElementById("version");
version.textContent = browser.runtime.getManifest().name + " (v"+ browser.runtime.getManifest().version + ")";

//$(document).ready(function(){
//  var radios = document.getElementsByName("counter");
//  var val = localStorage.getItem('counter');
//  for(var i=0;i<radios.length;i++){
//    if(radios[i].value == val){
//      radios[i].checked = true;
//    }
//  }
//$('input[name="counter"]').on('change', function(){
//    localStorage.setItem('counter', $(this).val());
//    backgroundPage.request.onload();
//  });
//});

$(document).ready(function(){
  var timer = document.getElementById("timer");
  var val = localStorage.getItem('timer');
  if (typeof val !== 'undefined' && val !== null){
    timer.value = localStorage.getItem('timer');
  }else{
    timer.value = 3;
  }
  $('input[name="timer"]').on('change', function(){
    localStorage.setItem('timer', $(this).val());
    backgroundPage.startTimer();
  });
 });

 $(document).ready(function(){
  var radios = document.getElementsByName("contextMenu");
  var val = localStorage.getItem('contextMenu');
  for(var i=0;i<radios.length;i++){
    if(radios[i].value == val){
      radios[i].checked = true;
    }
  }
$('input[name="contextMenu"]').on('change', function(){
    localStorage.setItem('contextMenu', $(this).val());
    backgroundPage.contextMenuFunction();
  });
});
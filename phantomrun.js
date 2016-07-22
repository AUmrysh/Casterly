var system = require('system');
var args = system.args;
var page = require('webpage').create();
var fs = require('fs');
//set up viewport
var w = 1080;
var h = 720;
page.viewportSize = {width:w,height:h};
page.clipRect = {top:0, left:0, width: w, height: h};
//begin loading page
page.open(args[1], function(){
  //loop through every 100ms
  setInterval(function(){
    //render to base64 png and write to stdout
    var buf =page.renderBase64("png");
    system.stdout.write(buf);
  }, 100);
});


//console.log("STARTING");
var system = require('system');
var args = system.args;
var page = require('webpage').create();
//var phantom = require('phantom-render-stream');
var fs = require('fs');
//var count = 0;
var w = 1080;
var h = 720;
page.viewportSize = {width:w,height:h};
page.clipRect = {top:0, left:0, width: w, height: h};
var ctr = 0;
page.open(args[1], function(){
  setInterval(function(){
    page.render("/dev/stdout", {format:"png"});
  }, 100);
});

//render('http://www.highcharts.com/demo/dynamic-update').pipe(fs.createWriteStream('live.png'));

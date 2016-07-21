var os = require("os");
var bonjour = require('bonjour')();
var myArgs = require('optimist').argv;
var Client = require("castv2-client").Client;
var DefaultMediaReceiver = require("castv2-client").DefaultMediaReceiver;
var args = process.argv;
var ipaddr = os.networkInterfaces()["eth0"][0]["address"]

var client = new Client();
var hosts = [];
var hostname = myArgs.c;

bonjour.find({type: 'googlecast'}, function(svc){
  if (svc.name.toUpperCase() === hostname.toUpperCase()) {
    ondeviceup(svc.addresses[0]);
  }
});
function ondeviceup(host) {

//var host = "192.168.1.21";
client.connect(host, function(){
  console.log("connected, launching stream");

  client.launch(DefaultMediaReceiver, function(err, player) {
    var media = {
      contentId: "http://"+ipaddr+":8099/cast-rtsp.h264",
      contentType: 'video/vp8',
      streamType: 'LIVE',
      metadata : {
        type: 0,
	metadataType: 0,
	title: "Casterly"
      }};
      player.load(media, {autoplay: true}, function(err, status) {
      });
  });
});

}

var os = require("os");
var bonjour = require('bonjour')();
var myArgs = require('optimist').argv;
var Client = require("castv2-client").Client;
var DefaultMediaReceiver = require("castv2-client").DefaultMediaReceiver;
var args = process.argv;
//var ipaddr = os.networkInterfaces()["eth0"][0]["address"]
var interfaces = os.networkInterfaces();

var client = new Client();
var hosts = [];
var hostname = myArgs.c;

//Determine network interfaces, take the first external ipv4
for (var nif in interfaces) {
  console.log(nif);
  if (interfaces[nif][0].internal === false) {
    localip = interfaces[nif][0].address;
    break;
  }
}

console.log(localip);

bonjour.find({type: 'googlecast'}, function(svc){
  if (svc.name.toUpperCase() === hostname.toUpperCase()) {
    ondeviceup(svc.addresses[0]);
  }
});
function ondeviceup(host) {

client.connect(host, function(){
  console.log("connected, launching stream");

  client.launch(DefaultMediaReceiver, function(err, player) {
    var media = {
      contentId: "http://"+localip+":8099/cast-rtsp.h264",
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

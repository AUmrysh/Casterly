var os = require("os");
var bonjour = require('bonjour')();
var myArgs = require('optimist').argv;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var Client = require("castv2-client").Client;
var DefaultMediaReceiver = require("castv2-client").DefaultMediaReceiver;
var args = process.argv;
//var ipaddr = os.networkInterfaces()["eth0"][0]["address"]
var interfaces = os.networkInterfaces();

var client = new Client();
var hosts = [];
var hostname = myArgs.c;
var url = myArgs.u;
var found = false;

//Determine network interfaces, take the first external ipv4
for (var nif in interfaces) {
  console.log(nif);
  if (interfaces[nif][0].internal === false && !found) {
    localip = interfaces[nif][0].address;
	bonjour.find({type: 'googlecast'}, function(svc){
	  if (svc.name.toUpperCase() === hostname.toUpperCase()) {
	    ondeviceup(svc.addresses[0]);
            found = true;
	  }
	});
  }
}

console.log(localip);
//determine if the chromecast was found
//if (!found) {
//  console.log("Unable to find specified chromecast on the network");
//}

function ondeviceup(host) {

//start up the child processes of ffmpeg, ffserver
var ffserver = spawn("ffserver", ["-f", "ffserver.conf"]);//, {stdio:['ignore','inherit','inherit']});
var phantom = spawn("phantomjs", ["phantomrun.js", url]);//, {stdio: ['ignore', 'ignore', 'inherit']});
phantom.stdout.setEncoding("binary");
var ffmpegargs = ["-y", "-r","30", "-c:v","png", "-f","image2pipe", "-i", "-", "-c:v","libvpx", "-r","30", "-vf", "scale=1080:720", "http://127.0.0.1:8099/feed1.ffm"];
console.log("Starting ffmpeg ", ffmpegargs.join(" "));
var ffmpeg = spawn("ffmpeg", ffmpegargs);//, {stdio:['ignore', 'inherit', 'inherit']});


phantom.on('error', (err) => {
  console.log("phantomJS error: ");
  console.log(err);
});

ffmpeg.on('error', (err) => {
  console.log("ffmpeg error: ");
  console.log(err);
});

phantom.on('close', (code) => {
  console.log("Phantom exited with code "+code);
});
ffmpeg.on('close', (code) => {
  console.log("ffmpeg exited with code "+code);
});

phantom.stdout.on('data', function(d){
  var buf = Buffer(d, "base64");
  ffmpeg.stdin.write(buf);
});

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

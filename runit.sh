#!/bin/bash
trap "killall phantomjs; killall nodejs; killall ffserver; killall ffmpeg" SIGINT SIGTERM
ffserver -f ./ffserver.conf &
phantomjs phantomrun.js $2 | ffmpeg -y -r 30 -c:v png -f image2pipe -i - -c:v libvpx -r 30 -vf scale=1080:720 http://127.0.0.1:8099/feed1.ffm &
nodejs cast.js -c "$1"


#!/bin/bash

set -eux

curr=$(cd $(dirname $0); pwd)

if [ $# -ne 1 ]; then
	echo '# Usage'
	echo '- $ bash editor.sh run'
	echo '- $ bash editor.sh attach'
	exit
fi

if [ "$1" == "run" ]; then
	docker run -d \
		--name editor-host \
		--privileged \
		--rm \
		-v ~/editor/app:/opt/app \
		-v /usr/bin/docker:/usr/bin/docker \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v /lib64/libdevmapper.so.1.02:/usr/lib/libdevmapper.so.1.02 \
		-v /lib64/libudev.so.0:/usr/lib/libudev.so.0 \
		-v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose \
		-p 80:80 \
		localhost:49000/editor-host:latest
elif [ "$1" == "attach" ]; then
	docker attach editor-host
fi
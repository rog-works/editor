#!/bin/bash

set -eux

curr=$(cd $(dirname $0); pwd)

if [ $# -ne 1 ]; then
	echo '# Usage'
	echo '- $ bash registry.sh export'
	echo '- $ bash registry.sh import'
	echo '- $ bash registry.sh upload'
	echo '- $ bash registry.sh run'
	exit
fi

if [ "$1" == "export" ]; then
	docker export docker_docker-registry-app_1 | gzip - > ${curr}/docker-registry.tgz
elif [ "$1" == "import" ]; then
	cat ${curr}/docker-registry.tgz | docker import - docker-registry:latest
elif [ "$1" == "upload" ]; then
	scp ${curr}/.bin/docker-registry.tgz aws:~/
elif [ "$1" == "run" ]; then
	docker run -d \
		--name docker-registry \
		-p 49000:5000 \
		docker-registry:latest \
		registry serve /etc/docker/registry/config.yml
fi

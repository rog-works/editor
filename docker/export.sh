#!/bin/bash

set -eux

curr=$(cd $(dirname $0); pwd)

if [ $# -eq 1 ] && [ "$1" == "-e" ]; then
	docker export docker_docker-registry-app_1 | gzip - > ${curr}/docker-registry.tgz
elif [ $# -eq 2 ] && [ "$1" == "-up" ]; then
	scp -i ~/.ssh/aws/ec2.pem ${curr}/*.tgz ec2-user@$2:~/
elif [ $# -eq 1 ] && [ "$1" == "-i" ]; then
	cat ${curr}/docker-registry.tgz | docker import - docker-registry:latest
elif [ $# -eq 2 ] && [ "$1" == "-r" ] && [ "$2" == "docker-registry" ]; then
	docker run -d -p 49000:5000 docker-registry:latest registry serve /etc/docker/registry/config.yml
elif [ $# -eq 2 ] && [ "$1" == "-r" ] && [ "$2" == "editor" ]; then
	docker run -it -v /home/ec2-user/app:/opt/app -p 80:80 --privileged localhost:49000/editor:latest bash
elif [ $# -eq 2 ] && [ "$1" == "-export" ];
	docker-compose exec docker export $2 | gzip - > /opt/app/$2.tgz
fi
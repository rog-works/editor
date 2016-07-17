#!/bin/bash

set -eux

curr=$(cd $(dirname $0); pwd)

if [ $# -eq 2 ] && [ "$1" == "export" ]; then
	docker export docker_$2-app_1 | gzip - > ${curr}/$2.tgz
elif [ $# -eq 2 ] && [ "$1" == "import" ]; then
	cat ${curr}/$2.tgz | docker import - $2:latest
elif [ $# -eq 2 ] && [ "$1" == "scp" ]; then
	scp -i ~/.ssh/aws/ec2.pem ${curr}/*.tgz ec2-user@$2:~/
elif [ $# -eq 2 ] && [ "$1" == "run" ] && [ "$2" == "docker-registry" ]; then
	docker run -d -p 49000:5000 docker-registry:latest registry serve /etc/docker/registry/config.yml
elif [ $# -eq 2 ] && [ "$1" == "run" ] && [ "$2" == "editor" ]; then
	docker run -it -v /home/ec2-user/app:/opt/app -p 80:80 --privileged localhost:49000/editor:latest bash
elif [ $# -eq 1 ] && [ "$1" == "start" ]; then
	docker start $( docker ps -a | grep editor | awk '{ print $1 }')
elif [ $# -eq 1 ] && [ "$1" == "attach" ]; then
	docker attach $( docker ps -a | grep editor | awk '{ print $1 }') 
elif [ $# -eq 1 ] && [ "$1" == "install" ]; then
	curl -fsSL https://get.docker.com/ | sh
	sudo service docker start
	sudo usermod -aG docker $(whoami)
	sudo service docker restart
fi
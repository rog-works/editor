#!/bin/bash

set -eux

curr=$(cd $(dirname $0); pwd)

if [ ! -f /usr/bin/docker ]; then
	curl -fsSL https://get.docker.com/ | sh
	sudo service docker start
	sudo usermod -aG docker $(whoami)
	sudo service docker restart
fi

if [ ! -f /usr/local/bin/docker-compose ]; then
	curl -L https://github.com/docker/compose/releases/download/1.7.0/docker-compose-`uname -s`-`uname -m` > ./docker-compose
	sudo mv ./docker-compose /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
fi

if [ ! -f  /usr/bin/git ]; then
	sudo yum install git
fi

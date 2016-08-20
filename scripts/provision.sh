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
	git config --global user.name "rog-works"
	git config --global user.email rog-works@yahoo.co.jp
	git config --global alias.st status
	git config --global alias.ci commit
	git config --global alias.br branch
	git config --global alias.ad add
	git config --global alias.co checkout
	git config --global alias.df diff
	git config --global alias.lola 'log --graph --decorate --oneline --all' 
fi

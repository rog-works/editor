#!/bin/bash

set -eux

curr=$(cd $(dirname $0); pwd)

if [ $# -ne 2 ]; then
	echo '# Usage'
	echo '- $ bash registry.sh export <container-name>'
	echo '- $ bash registry.sh import <container-name>'
	echo '- $ bash registry.sh upload <host>'
	echo '- $ bash registry.sh run -'
	exit
fi

if [ "$1" == "export" ]; then
	docker export docker_$2-app_1 | gzip - > ${curr}/$2.tgz
elif [ "$1" == "import" ]; then
	cat ${curr}/$2.tgz | docker import - $2:latest
elif [ "$1" == "upload" ]; then
	scp -i ~/.ssh/aws/ec2.pem ${curr}/*.tgz ec2-user@$2:~/
elif [ "$1" == "run" ]; then
	docker run -d \
		--name docker-registry \
		--rm \
		-p 49000:5000 \
		docker-registry:latest \
		registry serve /etc/docker/registry/config.yml
fi

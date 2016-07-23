#!/bin/bash

set -eux

if [ "$(whoami)" == "ec2-user" ]; then
	cd _compose/aws; docker-compose $*
else
	cd _compose; docker-compose $*
fi

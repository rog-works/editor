#!/bin/bash

set -ex

if [ "$(whoami)" == "dev" -o "$ENV" == "aws" ]; then
	cd _compose/aws; docker-compose $*
else
	cd _compose/local; docker-compose $*
fi

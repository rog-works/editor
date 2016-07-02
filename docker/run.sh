#!/bin/bash

set -eux

CURR_DIR=$(cd $(dirname $0); pwd)

REPOSITRY_NAME=$(echo $(dirname ${CURR_DIR}) | perl -nle 'print $1 if /([\w-]+)$/')
APP=${REPOSITRY_NAME}-app
COMMAND="up -d"
OPTIONS=""

if [ $# -gt 0 ]; then
	COMMAND=$1
	shift
	OPTIONS=$*
fi

docker-compose ${COMMAND} ${APP} ${OPTIONS}

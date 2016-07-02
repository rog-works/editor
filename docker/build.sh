#!/bin/bash

set -eux

if [ $# -eq 0 ]; then
	echo "invalid arguments. ${#}"
	echo "# usage"
	echo "bash build.sh [options]"
	echo "# descriptions"
	echo "--all: build tab push"
	echo "-b: build"
	echo "-t: tag"
	echo "-p: push"
	echo "# examples"
	echo "bash build.sh --all"
	exit 1
fi


TARGETS=""

while [ $# -gt 0 ]
do
	case $1 in
		"--all" )
			TARGETS="build tag push"
		break ;;
		"-b" )
			TARGETS="${TARGETS} build"
		;;
		"-t" )
			TARGETS="${TARGETS} tag"
		;;
		"-p" )
			TARGETS="${TARGETS} push"
		;;
	esac
	shift
done


CURR_DIR=$(cd $(dirname $0); pwd)

REPOSITRY_NAME=$(echo $(dirname ${CURR_DIR}) | perl -nle 'print $1 if /([\w-]+)$/')
APP=${REPOSITRY_NAME}

for C in ${TARGETS}
do
	case $C in
		"build" )
			docker build --rm -t ${APP} ${CURR_DIR}
		;;
		"tag" )
			docker tag ${APP} localhost:49000/${APP}
		;;
		"push" )
			docker push localhost:49000/${APP}
		;;
	esac
done

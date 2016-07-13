FROM node:6.2.2-slim

WORKDIR /opt/app

# Install docker
RUN apt-get update \
 && apt-get -y install \
      vim \
      apt-transport-https \
      ca-certificates \
      --no-install-recommends \
 && rm -rf /var/lib/apt/lists/* \
 && apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D \
 && echo 'deb https://apt.dockerproject.org/repo debian-jessie main' > /etc/apt/sources.list.d/docker.list \
 && apt-get update \
 && apt-get -y install docker-engine --no-install-recommends \
 && rm -rf /var/lib/apt/lists/* \
 && curl -L https://github.com/docker/compose/releases/download/1.7.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose \
 && chmod +x /usr/local/bin/docker-compose

# XXX Persistent
CMD tail -f /dev/null

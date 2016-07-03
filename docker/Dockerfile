FROM node:6.2.2-slim

ENV MAIN_SCRIPT /opt/app/server.js
ENV PORT 80

# Pre-install
COPY opt/ /opt/
WORKDIR /opt

# Install npm
RUN npm install --production \
 && npm cache clean \
# Install docker
 && apt-get update \
 && apt-get -y install \
      apt-transport-https \
      ca-certificates \
      --no-install-recommends \
 && rm -rf /var/lib/apt/lists/* \
 && apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D \
 && echo 'deb https://apt.dockerproject.org/repo debian-jessie main' > /etc/apt/sources.list.d/docker.list \
 && apt-get update \
 && apt-get -y install docker-engine --no-install-recommends \
 && rm -rf /var/lib/apt/lists/*

CMD node ${MAIN_SCRIPT}

FROM node:6.2.2-slim

WORKDIR /opt/app

# Install utilities
RUN apt-get update \
 && apt-get -y install vim --no-install-recommends \
 && rm -rf /var/lib/apt/lists/*

# XXX persistents for Container
CMD tail -f /dev/null

FROM node:6.2.2-slim

# Pre-install
COPY opt/ /opt/
WORKDIR /opt

# Install npm
RUN npm install --production \
 && npm cache clean \
 && mkdir /var/log/app

CMD node /opt/app/_editor/app/server.js

FROM node:6.2.2-slim

# Enviroments
ENV PORT=80
ENV MAIN_SCRIPT=/opt/app/server.js

# Pre-install
COPY opt/ /opt/
WORKDIR /opt

# Install npm
RUN npm install --production \
 && npm cache clean

# Expose Deirectory
VOLUME /var/log/app

CMD node ${MAIN_SCRIPT}

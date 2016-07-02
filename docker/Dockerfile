FROM node:6.2.2-slim

ENV MAIN_SCRIPT /opt/app/server.js
ENV PORT 80

# Pre-install
ADD opt/ /opt/
WORKDIR /opt

# Install
RUN npm install --production \
 && npm cache clean

CMD node ${MAIN_SCRIPT}

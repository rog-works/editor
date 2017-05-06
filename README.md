Editor
===

# Requirements
* docker
* docker-compose

# Dependecices
* Node.js
* TypeScript
* Express
* KnockoutJS
* Webpack
* Fluentd
* WebSocket

# Usage
```bash
# clone editor root
$ git clone git@github.com:rog-works/editor.git

# clone application
$ cd editor
$ git clone git@github.com:rog-works/editor-app.git app
# build docker images
$ bash compose.sh build

# install packages
$ docker run -it --rm -v `pwd`/app:/opt editor-webpack ash
[webpack]$ yarn install --no-bin-links
# transpile .ts to .js
[webpack]$ chmod +x -R node_modules/ # XXX permittion denied...
[webpack]$ node_modules/typescript/bin/tsc
[webpack]$ exit

# start application
$ bash compose.sh up -d
```

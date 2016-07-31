'use strict';
class WS {
	constructor (uri = 'ws://localhost:18082') {
		this.uri = uri;
		this.socket = this._connect(this.uri);
		this.handlers = {
			message: [],
			open: [],
			close: [this._retry]
		};
	}
	
	_connect (uri) {
		try {
		    let socket = new WebSocket(uri);
    		socket.onmessage = this._onMessage;
    		socket.onopen = this._onOpen;
    		socket.onclose = this._onClose;
    		return socket;
		} catch (error) {
		    console.log(error);
		    return null;
		}
	}

	_retry () {
	    for (let count = 0; count < 5; count += 1) {
	        let socket = this._connect(this.uri);
	        if (socket !== null) {
	            this.socket = socket;
	            break;
	        }
	    }
	}

	on (tag, handler) {
		if (tag in this.handlers) {
			this.handlers[tag].unshift(handler);
		}
	}

	listen (tag, ...args) {
		console.log(tag, args);
		for (let handler of this.handlers[tag]) {
			if (!handler.apply(this, args)) {
				break;
			}
		}
	}

	_onMessage (msg) {
		// XXX via fluent-plugin-websocket
		APP.ws.listen('message', JSON.parse(msg.data));
	}

	_onOpen () {
		APP.ws.listen('open');
	}

	_onClose () {
		APP.ws.listen('close');
	}
}
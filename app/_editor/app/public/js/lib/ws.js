'use strict';
class WS {
	constructor (uri = 'ws://localhost:18082') {
		this.handlers = {
			message: [],
			open: [],
			close: []
		};
		this.socket = new WebSocket(uri);
		this.socket.onmessage = this._onMessage;
		this.socket.onopen = this._onOpen;
		this.socket.onclose = this._onClose;
	}

	on (tag, handler) {
		if (tag in this.handlers) {
			this.handlers[tag].push(handler);
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
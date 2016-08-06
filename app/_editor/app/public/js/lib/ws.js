'use strict';

const RETRY_MAX = 5;

class WS {
	constructor (uri = 'ws://localhost:18082') {
		this.uri = uri;
		this.handlers = {
			message: [],
			open: [],
			close: [this._retry]
		};
		this.socket = WS.connect(this);
	}
	
	static connect (self) {
		try {
			let socket = new WebSocket(self.uri);
			socket.onmessage = (msg) => { self._onMessage(msg); };
			socket.onopen = () => { self._onOpen(); };
			socket.onclose = () => { self._onClose(); };
			console.log('Connected web socket. ' + self.uri);
			return socket;
		} catch (error) {
			console.error(error.message, error.stack);
			return null;
		}
	}

	_retry () {
		for (let count = 0; count < RETRY_MAX; count += 1) {
			let socket = WS.connect(this);
			if (socket !== null) {
				this.socket = socket;
				return;
			}
		}
		console.error('Disconnected web socket. ' + this.uri);
	}

	on (tag, handler) {
		if (tag in this.handlers) {
			this.handlers[tag].unshift(handler);
		}
	}

	listen (tag, ...args) {
		console.log(tag, args);
		for (let handler of this.handlers[tag]) {
			if (!handler(...args)) {
				break;
			}
		}
	}

	_onMessage (msg) {
		// XXX via fluent-plugin-websocket
		this.listen('message', JSON.parse(msg.data));
	}

	_onOpen () {
		this.listen('open');
	}

	_onClose () {
		this.listen('close');
	}
}

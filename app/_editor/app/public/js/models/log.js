'use strict';
class Log extends _Log {
	constructor () {
		super();
		this.socket = null;
	}

	static init (wsUri = 'ws://localhost:18082', id = 'log-main') {
		let self = new Log();
		this.socket = new WebSocket(wsUri);
		this.socket.onmessage = self._onMessage;
		this.socket.onopen = self._onOpen;
		this.socket.onclose = self._onClose;
		ko.applyBindings(self, document.getElementById(id));
		return self;
	}

	on (msgs) {
		console.log(msgs);
		for (let key in msgs) {
			super.on(msgs[key]);
		}
	}

	_onMessage (res) {
		let data = JSON.parse(res.data);
		data.forEach((msgs) => {
			// XXX this binding...
			APP.log.on(msgs);
		});
	}

	_onOpen () {
		console.log('open');
	}

	_onClose () {
		console.log('close');
	}
}


'use strict';
class Log extends _Log {
	constructor () {
		super();
		this.socket = null;
	}

	static init (wsUri = 'ws://localhost:18082', id = 'log-main') {
		let self = new Log();
		this.socket = new WebSocket(wsUri);
		this.socket.onmessage = (res) => {
			let data = JSON.parse(res.data);
			data.forEach((msgs) => {
				self.on(msgs);
			});
		};
		this.socket.onopen = () => { console.log('open'); };
		this.socket.onclose = () => { console.log('close'); };
		ko.applyBindings(self, document.getElementById(id));
		return self;
	}

	clear () {
		this.logs([]);
	}

	on (msgs) {
		console.log(msgs);
		for (let key in msgs) {
			super.on(msgs[key]);
		}
	}
}


'use strict';
class Log {
	constructor () {
		this.socket = null;
		this.logs = [];
		// this.msg = '';
	}

	static init () {
		let self = new Log();
		this.socket = new WebSocket('ws://localhost:18082');
		this.socket.onmessage = (res) => {
			let data = JSON.parse(res.data);
			data.forEach((msgs) => {
				self.on(msgs);
			});
		};
		this.socket.onopen = () => { console.log('open'); };
		this.socket.onclose = () => { console.log('close'); };
		self.logs = ko.observableArray(self.logs);
		// self.msg = ko.observable(self.msg);
		ko.applyBindings(self, document.getElementById('log-main'));
		return self;
	}

	// emit () {
	// 	console.log(this.msg());
	// 	this.socket.send(this.msg());
	// }

	clear () {
		this.logs([]);
	}

	on (msgs) {
		console.log(msgs);
		for (let key in msgs) {
			this.logs.push({log: msgs[key]});
		}
	}
}

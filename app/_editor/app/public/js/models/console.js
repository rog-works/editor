'use strict';

class Console extends _Log {
	constructor () {
		super();
	}

	static init (id = 'console-main') {
		let self = new Console();
		ko.applyBindings(self, document.getElementById(id));
		self.bind();
		return self;
	}

	bind () {
		const _log = console.log;
		const _error = console.error;
		let self = this;
		console.log = (...args) => {
			_log.apply(console, args);
			self.on.apply(self, args);
		};
		console.error = (...args) => {
			_error.apply(console, args);
			self.on.apply(self, args);
		};
	}

	on (...args) {
		const head = args.shift();
		this.line(head);
		for (const arg of args) {
			return this.put(arg);
		}
	}
}


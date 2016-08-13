'use strict';

class _Log {
	constructor () {
		this.logs = ko.observableArray(self.logs);
	}

	clear () {
		this.logs.removeAll();
	}

	put (log) {
		return this._on(log, false);
	}

	line (log) {
		return this._on(log, true);
	}

	_on (log, separated) {
		// console.log(log, separated);
		this.logs.push(new LogLine(log, separated));
		return true;
	}
}

class LogLine {
	constructor (log, separated) {
		this.log = ko.observable(log);
		this.closed = ko.observable(false);
		this.separated = ko.observable(separated);
	}

	expand () {
		this.closed(!this.closed());
	}
}

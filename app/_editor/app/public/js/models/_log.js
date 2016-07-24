'use strict';
class _Log {
	constructor () {
		this.logs = ko.observableArray(self.logs);
	}

	clear () {
		this.logs.removeAll();
	}

	on (log) {
		console.log(log);
		this.logs.push(new LogLine(log));
	}
}

class LogLine {
	constructor (log) {
		this.log = ko.observable(log);
		this.css = ko.observable('');
	}

	expand () {
		if (this.css() === '') {
			this.css('line-close');
		} else {
			this.css('');
		}
	}
}

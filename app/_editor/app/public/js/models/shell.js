'use strict';
class Shell extends _Log {
	constructor () {
		super();
		this.query = ko.observable('');
		this.css = ko.observable('');
		this.history = ko.observableArray([]);
	}

	static init (id = 'shell-main') {
		let self = new Shell();
		ko.applyBindings(self, document.getElementById(id));
		return self;
	}

	click (self, e) {
		if (e.keyCode !== 13) {
			return true;
		}
		let query = this.query();
		if (query.length === 0) {
			return true;
		}
		this.query('');
		this.css('disabled');
		$.post('/shell', {query: query}, (result) => {
			let log = `$ ${query}\n${result.output}`
			this.on(log);
			this.css('');
			if (this.history.indexOf(query) === -1) {
				this.history.push(query);
			}
		});
		return false;
	}
}

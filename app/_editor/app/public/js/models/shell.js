'use strict';

const KEY_CODE_ENTER = 13;

class Shell extends _Log {
	constructor () {
		super();
		this.query = ko.observable('');
		this.css = ko.observable('');
		this.history = ko.observableArray([]);
	}

	static init (id = 'shell-main') {
		const self = new Shell();
		// XXX depends on APP...
		APP.ws.on('message', (msg) => { return self._onMessage(msg); });
		ko.applyBindings(self, document.getElementById(id));
		return self;
	}

	click (self, e) {
		if (e.keyCode !== KEY_CODE_ENTER) {
			return true;
		}
		const query = this.query();
		if (query.length === 0) {
			return true;
		}
		this.query('');
		this.line(`$ ${query}`);
		this.css('disabled');
		$.ajax({
			url: '/shell',
			type: 'POST',
			data: {query: query},
			dataType: 'json',
			success: (result) => {
				this.css('');
				if (this.history.indexOf(query) === -1) {
					this.history.push(query);
				}
			},
			error: (res, err) => {
				console.error(err, res.status, res.statusText, res.responseText);
			}
		});
		return false;
	}

	_onMessage ([tag, data]) {
		if (tag === 'editor.shell-log') {
			return this.put(data.message);
		}
		return true;
	}
}

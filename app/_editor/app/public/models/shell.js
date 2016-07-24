'use strict';
class Shell {
	constructor () {
		this.query = '';
		this.logs = '';
		this.css = 'btn-success glyphicon-play';
	}

	static init () {
		let self = new Shell();
		self.query = ko.observable(self.query);
		self.logs = ko.observable(self.logs);
		self.css = ko.observable(self.css);
		ko.applyBindings(self, document.getElementById('shell-main'));
		return self;
	}

	click () {
		this._publish();
	}

	clear () {
		this.logs('');
	}

	_beforePublish () {
		this.css('btn-danger glyphicon-remove disabled');
		this.query('');
	}

	_publish () {
		let query = this.query();
		this._beforePublish();
		$.post('/shell', {query: query}, (result) => {
			this.logs(`${this.logs()}${result.query}\n${result.output}`);
			this._afterPublish();
			// XXX
			$('#shell-query').focus();
		});
	}

	_afterPublish () {
		this.css('btn-success glyphicon-play');
	}
}

'use strict';

class Tool {
	constructor () {
		this.page = ko.observable('editor');
	}

	static init (id = 'tool') {
		const self = new Tool();
		// ko.applyBindings(self, document.getElementById(id));
		return self;
	}

	activate (page) {
		this.page(page);
	}
}

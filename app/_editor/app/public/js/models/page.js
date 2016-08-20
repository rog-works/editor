'use strict';

class Page {
	constructor (width = 360, height = 520) {
		this.style = {
			width: ko.observable(width),
			height: ko.observable(height)
		};
	}
	
	resize (widtg, height) {
		this.style.width(width);
		// XXX this.style.height(height);
	}
}

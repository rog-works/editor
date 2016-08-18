'use strict';

class Application {
	constructor () {
		this.ws = null;
		this.tool = null;
		this.console = null;
		this.editor = null;
		this.entry = null;
		this.shell = null;
		this.log = null;
		this.w = 0;
		this.h = 0;
	}

	load(id = 'main') {
		try {
			this.ws = new WS();
			this.tool = Tool.init();
			this.console = Console.init();
			this.editor = Editor.init();
			this.entry = Entry.init();
			this.shell = Shell.init();
			this.log = Log.init();
			ko.applyBindings(this, document.getElementById(id));
			this._after();
		} catch (error) {
			console.error(error.message, error.stack);
		}
	}
	
	_after () {
		const self = this;
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.w = Math.max(w, h);
		this.h = Math.min(w, h);
		this.resize();
		// XXX handling for resize event
		window.onresize = () => { self.resize(); };
	}
	
	test () {
		try {
			console.log('resize scale');
			const viewport = document.getElementsByName('viewport')[0];
			viewport.setAttribute('content', `width=device-width, initial-scale=1.0`);
		} catch (error) {
			console.error(error.message, error.stack);
		}
	}
	
	resize () {
		console.log('resize');
		// XXX Diviated with the software keyboard is Displayed
		const w = window.innerWidth;
		const h = window.innerHeight;
		const fit = $('.fit');
		fit.width(w);
		fit.height(h);
		$('.flex-w-32').width(w - 32);
		// XXX
		this.editor._editor().resize();
		console.log(w, h);
		// const viewport = document.getElementsByName('viewport')[0];
		// viewport.setAttribute('content', `width=${this.w},initial-scale=1.0`);
	}
}

const APP = new Application();
window.onload = () => { APP.load(); };

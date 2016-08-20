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
		// XXX
		this.style = {
			width: ko.observable(360),
			height: ko.observable(520)
		};
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
		console.log('on resize');
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.style.width(w);
		this.style.height(h);
		$('.flex-w-32').width(w - 32);
		// XXX
		this.editor.resize();
		console.log(w, h);
	}
}

const APP = new Application();
window.onload = () => { APP.load(); };

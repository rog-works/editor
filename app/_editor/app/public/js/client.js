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
	}

	load (id = 'main') {
		this.ws = new WS();
		this.tool = Tool.init();
		this.console = Console.init();
		this.editor = Editor.init();
		this.entry = Entry.init();
		this.shell = Shell.init();
		this.log = Log.init();
		ko.applyBindings(this, document.getElementById(id));
	}
};
let APP = new Application();
$(() => {
	try {
		// XXX 
		APP.load();
	} catch (error) {
		console.error(error.message, error.stack);
	}

	const onResize = () => {
		// XXX Diviated with the software keyboard is Displayed
		const w = window.innerWidth;
		const h = window.innerHeight;
		const fit = $('.fit');
		fit.width(w);
		fit.height(h);
		$('.flex-w-32').width(w - 32);
		// XXX
		APP.editor._editor().resize();
	};
	onResize();

	// handling for resize event
	$(window).on('resize', onResize);
});

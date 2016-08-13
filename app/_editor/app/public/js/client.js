'use strict';

let APP = {};
$(() => {
	try {
		// XXX 
		$.extend(APP, {
			ws: new WS(),
		});
		$.extend(APP, {
			console: Console.init(),
			editor: Editor.init(),
			entry: Entry.init(),
			shell: Shell.init(),
			log: Log.init()
		});
	} catch (error) {
		console.error(error.message, error.stack);
	}
	let onRotate = () => {
		// XXX Diviated with the software keyboard is Displayed
	    let h = window.innerHeight;
	    let ids = [
	        '#content',
	        '#menu-xs'
        ];
	    for (let id of ids) {
	        $(id).height(h);
	    }
	    // XXX
	    APP.editor._editor().resize();
	};
	onRotate();
	
	// handling for resize event
	$(window).on('resize', onRotate);
});

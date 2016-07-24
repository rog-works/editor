'use strict';
let APP = {};
$(() => {
	$.extend(APP, {
		editor: Editor.init(),
		entry: Entry.init(),
		shell: Shell.init(),
		log: Log.init()
	});
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
	};
	onRotate();
	
	// handling for resize event
	$(window).on('resize', onRotate);
});

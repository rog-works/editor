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
	
	// handling for orientation change
	$(window).on('orientationchange', onRotate);
});

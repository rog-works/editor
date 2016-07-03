'use strict';

$(() => {
	let Editor = {
		_editor: $('div#editor'),
		onLoad: (content) => {
			this._editor.html(content);
		}
	};
	let Entry = {
		_main: $('ul#entry-main'),
		_append: $('input#entry-append'),
		_dialog: $('#entry-append-dialog'),
		_dialogOk: $('#entry-append-dialog input#ok'),
		_dialogCancel: $('#entry-append-dialog input#cancel'),
		_dialogPath: $('#entry-append-dialog input#path'),
		// 
		regist: () => {
			Entry._registLoad();
			Entry._registAppend();
		},
		_registLoad: () => {
			$.get('/entry', (res) => {
				Entry.onLoad(res);
			});
		},
		_registAppend: () => {
			Entry._append.on('click', (event) => {
				Entry.onAppendBefore();
				event.preventDefault();
			});
			Entry._dialogOk.on('click', (event) => {
				let path = Entry._dialogPath.val();
				Entry.onAppend(path);
				event.preventDefault();
			});
			Entry._dialogCancel.on('click', (event) => {
				Entry.onAppendCancel();
				event.preventDefault();
			});
		},
		_registEntries: () => {
			Entry._main.find('li').on('click', (event) => {
				let eEntry = $(event.toElement);
				Entry.onSelected(eEntry);
				event.preventDefault();
			});
		},
		// 
		onLoad: (entries) => {
			let lis = Entry._toDOM(entries);
			Entry._main.html(lis.join(''));
			Entry._registEntries();
		},
		// 
		onSelected: (eEntry) => {
			$.get(eEntry.attr('url'), (res) => {
				Editor.onLoad(res.content);
				Entry._main.find('li').removeClass('on');
				eEntry.addClass('on');
			});
		},
		onAppendBefore: () => {
			Entry._dialog.show();
		},
		onAppend: (path) => {
			$.post('/entry', {path: path, content: ''}, (res) => {
				Entry._registLoad();
				let param = encodeURIComponent(res.path);
				let entry = Entry._main.find(`li[url="/entry/${param}"]`)
				Entry.onSelected(entry);
			});
		},
		onAppendCancel: () => {
			Entry._dialog.hide();
			Entry._dialogPath.val('');
		},
		// 
		_toDOM: (entries) => {
			return entries.map((self) => {
				let param = encodeURIComponent(self.path);
				return `<li><a url="/entry/${param}">${self.name}</a></li>`;
			});
		}
	};

	// entry container
	Entry.regist();

	// 
	
	
	// 
	

	// 
	
});
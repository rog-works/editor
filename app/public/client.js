'use strict';

$(() => {
	let Editor = {
		_editor: $('div#editor'),
		onLoad: (content) => {
			let session = ace.edit('editor').getSession();
			session.setMode('ace/mode/javascript');
			session.setValue(content);
		}
	};
	let Entry = {
		_main: $('#entry-main'),
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
				event.preventDefault();
				Entry.onAppendBefore();
			});
			Entry._dialogOk.on('click', (event) => {
				event.preventDefault();
				let path = Entry._dialogPath.val();
				Entry.onAppend(path);
			});
			Entry._dialogCancel.on('click', (event) => {
				event.preventDefault();
				Entry.onAppendCancel();
			});
		},
		_registEntries: () => {
			Entry._main.find('a').on('click', (event) => {
				event.preventDefault();
				let eEntry = $(event.toElement);
				Entry.onSelected(eEntry);
			});
		},
		// 
		onLoad: (entries) => {
			let strEntries = Entry._toDOM(entries);
			Entry._main.html(strEntries.join(''));
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
				let eEntry = Entry._main.find(`a[url="/entry/${param}"]`);
				Entry.onSelected(eEntry);
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
				let isFile = self.type === 'file';
				let classes = isFile ? 'file' : 'folder-close';
				return `<tr><td><i class="glyphicon glyphicon-${classes}"><a url="/entry/${param}">${self.name}</a></i></td></tr>`;
			});
		}
	};

	// entry container
	Entry.regist();
});
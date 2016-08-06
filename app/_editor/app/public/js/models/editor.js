'use strict';
class Editor {
	constructor () {
		this.path = null;
	}

	static init () {
		let self = new Editor();
		self.path = ko.observable('#');
		ko.applyBindings(self, document.getElementById('editor-save-xs'));
		self.load();
		return self;
	}

	_editor () {
		return ace.edit('editor');
	}
	
	_toMode (ext) {
		let map = {
			sh: 'sh',
			py: 'python',
			php: 'php',
			css: 'css',
			html: 'html',
			json: 'json',
			js: 'javascript',
			rb: 'ruby',
			yml: 'yaml',
			yaml: 'yaml'
		};
		return (ext in map) ? `ace/mode/${map[ext]}` : 'ace/mode/sh';
	}

	load (path = '#', content = '') {
		let editor = this._editor();
		let session = editor.getSession();
		let ext = path.substr(path.lastIndexOf('.') + 1);
		let mode = this._toMode(ext);
		session.setValue(content);
		session.setMode(mode);
		this.path(path);
		editor.focus();
	}

	save () {
		if (Entry.validSavePath(this.path())) {
			Entry.update(this.path(), this.content());
		}
	}

	content () {
		return this._editor().getSession().getValue();
	}
}

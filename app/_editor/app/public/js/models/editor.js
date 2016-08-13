'use strict';

class Editor {
	constructor () {
		this.path = ko.observable('#');
	}

	static init () {
		let self = new Editor();
		ko.applyBindings(self, document.getElementById('editor-save-xs'));
		self.load();
		return self;
	}

	_configure (ext) {
		const config = {
			sh: {mode: 'sh', tabs: 4, softTabs: false},
			py: {mode: 'python', tabs: 4, softTabs: false},
			php: {mode: 'php', tabs: 4, softTabs: false},
			css: {mode: 'css', tabs: 4, softTabs: false},
			html: {mode: 'html', tabs: 4, softTabs: false},
			json: {mode: 'json', tabs: 4, softTabs: false},
			js: {mode: 'javascript', tabs: 4, softTabs: false},
			rb: {mode: 'ruby', tabs: 2, softTabs: true},
			yml: {mode: 'yaml', tabs: 2, softTabs: true},
			yaml: {mode: 'yaml', tabs: 2, softTabs: true}
		};
		return (ext in config) ? config[ext] : config.sh;
	}

	_editor () {
		return ace.edit('editor');
	}

	_toMode (mode) {
		return `ace/mode/${mode}`;
	}

	load (path = '#', content = '') {
		const ext = path.substr(path.lastIndexOf('.') + 1);
		const config = this._configure(ext);
		let editor = this._editor();
		let session = editor.getSession();
		session.setValue(content);
		session.setTabSize(config.tabs);
		session.setUseSoftTabs(config.softTabs);
		session.setMode(this._toMode(config.mode));
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

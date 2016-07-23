'use strict';
$(() => {

	// Log model
	class Log {
		constructor () {
		    this.socket = null;
			this.logs = [];
			// this.msg = '';
		}

		static init () {
			let self = new Log();
		    this.socket = new WebSocket('ws://localhost:18082');
			this.socket.onmessage = (res) => {
				let data = JSON.parse(res.data);
			    data.forEach((msgs) => {
			        self.on(msgs);
			    });
		    };
			this.socket.onopen = () => { console.log('open'); };
			this.socket.onclose = () => { console.log('close'); };
			self.width = window.screen.width;
			self.height = window.screen.height;
			self.logs = ko.observableArray(self.logs);
			// self.msg = ko.observable(self.msg);
			ko.applyBindings(self, document.getElementById('log-main'));
			return self;
		}

		// emit () {
		// 	console.log(this.msg());
		// 	this.socket.send(this.msg());
		// }

		clear () {
			this.logs([]);
		}

		on (msgs) {
			console.log(msgs);
			for (let key in msgs) {
				this.logs.push({log: msgs[key]});
			}
		}
	}

	// Editor model
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
	        return (ext in map) ? `ace/mode/${map[ext]}` : 'ace/mode/javascript';
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

	class Entry {
		constructor () {
		}

		extend (entity) {
			this.type = entity.type;
			this.path = ko.observable(entity.path);
			this.class = ko.observable(Entry.toClass(this.type));
			this.selected = ko.observable('');
			this.edited = 'isTrue';
			this.attr = {
				dir: entity.dir
			};;
		}

		static update (path, content) {
			let url = '/entry/' + encodeURIComponent(path);
			$.ajax({
				url: url,
				type: 'PUT',
				dataType: 'json',
				data: {content: content},
				success: (entity) => {
					console.log(entity);
				}
			});
		}

		static create (path) {
			$.post('/entry', {path: path}, (entity) => {
				let entry = Entry.factory(entity);
				app.entry.entries.push(entry);
			});
		}

		rename () {
			let to = window.prompt('change file path', this.path());
			if (!Entry.validSavePath(to) || Entry.pathExists(to)) {
				return;
			}
			let encodePath = encodeURIComponent(this.path());
			let encodeParam = $.param({to: to});
			let url = `/entry/${encodePath}/rename?${encodeParam}`;
			$.ajax({
				url: url,
				type: 'PUT',
				dataType: 'json',
				success: (toPath) => {
					this.path(toPath);
				}
			});
		}

		delete () {
			let ok = confirm(`'${this.path()}' deleted?`);
			if (!ok) {
				console.log('delete cancel');
				return;
			}
			let path = this.path();
			let url = '/entry/' + encodeURIComponent(path);
			$.ajax({
				url: url,
				type: 'DELETE',
				dataType: 'json',
				success: (deleted) => {
					let removed = app.entry.entries.remove((self) => {
						return self.path() === path;
					});
					console.log(removed);
				}
			});
		}

		static init () {
			let self = new EntryRoot();
			self.entries = ko.observableArray(self.entries);
			ko.applyBindings(self, document.getElementById('entry-main'));
			self.load();
			return self;
		}

		load (path = '/') {
			let param = $.param({dir: path});
			let url = `/entry?${param}`;
			$.get(url, (entities) => {
				let entries = Entry.toEntries(entities);
				app.entry.entries.removeAll();
				for (let entry of entries) {
					app.entry.entries.push(entry);
				}
				app.entry.entries.push(new EntryAdd());
			});
		}

		static validSavePath (path) {
			if (typeof path !== "string" || path.length === 0) {
				console.log('invalid argument');
				return false;
			}
			if (/[^\d\w\-\/_.]+/.test(path)) {
				console.log('not allowed path characters');
				return false;
			}
			return true;
		}

		static pathExists (path) {
			for (let entry of app.entry.entries()) {
				if (entry.path() === path) {
					return true;
				}
			}
			return false;
		}

		static toEntries (entities) {
			return entities.map((self) => {
				return Entry.factory(self);
			});
		}

		static factory(entry) {
			if (entry.type === 'file') {
				return new EntryFile(entry);
			} else {
				return new EntryDirectory(entry);
			}
		}

		static toClass (type) {
			const classes = {
				file: 'glyphicon-file',
				directory: 'glyphicon-folder-open',
				directoryClose:  'glyphicon-folder-close'
			};
			return classes[type];
		}
	}

	class EntryRoot extends Entry {
		constructor (entity) {
			super();
			this.entries = [];
		}
	}

	class EntryAdd extends Entry {
		constructor () {
			super();
			super.extend({
				type: 'directory',
				path: '- create file -',
				dir: ''
			});
			this.edited = 'isFalse';
		}

		click () {
			let path = window.prompt('input create file path', '/');
			if (Entry.validSavePath(path) && !Entry.pathExists(path)) {
				Entry.create(path);
			}
		}
	}

	class EntryFile extends Entry {
		constructor (entity) {
			super();
			super.extend(entity);
		}

		load (path = '/') {
			let url = '/entry/' + encodeURIComponent(path);
			$.get(url, (entity) => {
				// XXX auto closing to focus editor
				$('#menu-xs-close').click();
				app.editor.load(entity.path, entity.content);
				this.activate();
			});
		}

		activate () {
			for (let entry of app.entry.entries()) {
				entry.selected('');
			}
			this.selected('active');
		}

		click () {
			this.load(this.path());
		}
	}

	class EntryDirectory extends Entry {
		constructor (entity) {
			super();
			super.extend(entity);
			this.opened = true;
		}

		toggle (dir) {
			// XXX
			$(`#entry-main li[dir^="${dir}"]`).toggleClass('hide');
		}

		click () {
			this.opened = !this.opened;
			let toggleClass = Entry.toClass(this.opened ? 'directory' : 'directoryClose');
			this.class(toggleClass);
			this.toggle(this.path());
		}
	}

	class Shell {
		constructor () {
			this.query = '';
			this.logs = '';
			this.css = 'btn-success glyphicon-play';
		}

		static init () {
			let self = new Shell();
			self.query = ko.observable(self.query);
			self.logs = ko.observable(self.logs);
			self.css = ko.observable(self.css);
			ko.applyBindings(self, document.getElementById('shell-main'));
			return self;
		}

		click () {
			this._publish();
		}

        clear () {
            this.logs('');
        }

		_beforePublish () {
			this.css('btn-danger glyphicon-remove disabled');
			this.query('');
		}

		_publish () {
			let query = this.query();
			this._beforePublish();
			$.post('/shell', {query: query}, (result) => {
				this.logs(`${this.logs()}${result.query}\n${result.output}`);
				this._afterPublish();
				// XXX
				$('#shell-query').focus();
			});
		}

		_afterPublish () {
			this.css('btn-success glyphicon-play');
		}
	}

	let app = {
		editor: Editor.init(),
		entry: Entry.init(),
		shell: Shell.init(),
		ws: Log.init()
	};
});

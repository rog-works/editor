'use strict';
$(() => {

	// WebSocket
	class WS {
		constructor () {
		    this.socket = null;
			this.msgs = [];
			this.msg = '';
		}

		static init () {
			let self = new WS();
		    this.socket = new WebSocket('ws://localhost:18082');
			this.socket.onmessage = (res) => {
			    res.data.forEach((msg) => {
			        self.on(msg);
			    });
		    };
			this.socket.onopen = () => { console.log('open'); };
			this.socket.onclose = () => { console.log('close'); };
			self.msgs = ko.observableArray(self.msgs);
			self.msg = ko.observable(self.msg);
			ko.applyBindings(self, document.getElementById('chat-main'));
			return self;
		}

		emit () {
			console.log(this.msg());
			//this.socket.emit('chat', this.msg());
			this.socket.send(this.msg());
		}

		on (msg) {
			console.log(msg);
			this.msgs.push({msg: msg});
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

		load (path = '#', content = '') {
			let editor = this._editor();
			let session = editor.getSession();
			session.setValue(content);
			session.setMode('ace/mode/javascript');
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
		ws: WS.init()
	};
});

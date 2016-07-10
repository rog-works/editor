'use strict';
$(() => {

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

		_session () {
			return ace.edit('editor').getSession();
		}

		load (path = '#', content = '') {
			let session = this._session();
			session.setValue(content);
			session.setMode('ace/mode/javascript');
			this.path(path);
		}

		save () {
			Entry.update(this.path(), this.content());
		}

		content () {
			return this._session().getValue();
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
			this.attr = {
				dir: entity.dir,
				edited: true
			}
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
			if (!Entry.validPath(to)) {
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

		static validPath (path) {
			if (path === null) {
				return false;
			}
			if (/[^\d\w\-\/_.]+/.test(path)) {
				console.log('invalid file path');
				return false;
			}
			for (let entry of app.entry.entries()) {
				if (entry.path() === path) {
					console.log('already file path');
					return false;
				}
			}
			return true;
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
			this.attr.edited = false;
		}

		click () {
			let path = window.prompt('input create file path', '/');
			if (!Entry.validPath(path)) {
				return;
			}
			Entry.create(path);
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
			$(`#entry-main li[dir="${dir}"]`).toggleClass('hide');
		}

		click () {
			this.opened = !this.opened;
			let toggleClass = Entry.toClass(this.opened ? 'directory' : 'directoryClose');
			this.class(toggleClass);
			this.toggle(this.path());
		}
	}
	let app = {
		editor: Editor.init(),
		entry: Entry.init()
	};
});
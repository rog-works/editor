'use strict';
$(() => {

	// knockoutjs
	class Editor {
		static _get () {
		}

		static _session () {
			return ace.edit('editor').getSession();
		}

		static init () {
			Editor.load();
		}

		static load (entry = null) {
			let self = Editor._get();
			self.path(entry.path);
			let session = Editor._session();
			let content = entry !== null ? entry.content : '';
			session.setValue(entry.content);
			session.setMode('ace/mode/javascript');

			if (entry !== null) {
				let model = {
					save: entry.update
				};
				ko.applyBindings(model, document.getElementById('editor-save-xs'));
			}
		}

		save () {
			Entry.update(this.path, this.content());
		}

		content () {
			return Editor._session().getValue();
		}
	}

	class Entry {
		constructor (entity) {
			$.extend(this, entity);
			this.attr = {
				dir: entity.dir
			}
			this.path = ko.observable(this.path);
			this.class = ko.observable(Entry.toClass(this.type));
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

		rename () {
			let to = window.prompt('change file path', this.path());
			if (to === null || this.path() === to) {
				console.log('not changed');
				return;
			}
			if (/[^\d\w\-\/_.]+/.test(to)) {
				console.log('invalid file path');
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
			let url = '/entry/' + encodeURIComponent(this.path());
			$.ajax({
				url: url,
				type: 'DELETE',
				dataType: 'json',
				success: (deleted) => {
					console.log(deleted);
				}
			});
		}

		static init () {
			EntryDirectory.load();
		}

		static toModel (entities) {
			return {
				entries: entities.map((self) => {
					if (self.type === 'file') {
						return new EntryFile(self);
					} else {
						return new EntryDirectory(self);
					}
				})
			};
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

	class EntryEmpty {
		constructor () {
			this.name = '';
			this.content = '';
		}
		create () {}
		update () {}
		rename () {}
		delete () {}
		click () {}
	}

	class EntryFile extends Entry {
		constructor (entity) {
			super(entity);
		}

		static load (path = '/') {
			let url = '/entry/' + encodeURIComponent(path);
			$.get(url, (entity) => {
				let entry = new EntryFile(entity);
				Editor.load(entry);
			});
		}

		click () {
			EntryFile.load(this.path());
		}
	}

	class EntryDirectory extends Entry {
		constructor (entity) {
			super(entity);
			this.opened = true;
		}

		static load (path = '/') {
			let param = $.param({dir: path});
			let url = `/entry?${param}`;
			$.get(url, (entities) => {
				let model = Entry.toModel(entities);
				ko.applyBindings(model, document.getElementById('entry-main'));
			});
		}

		static toggle (dir) {
			// XXX
			$(`#entry-main li[dir="${dir}"]`).toggleClass('hide');
		}

		click () {
			this.opened = !this.opened;
			let toggleClass = Entry.toClass(this.opened ? 'directory' : 'directoryClose');
			this.class(toggleClass);
			EntryDirectory.toggle(this.path());
		}
	}

	Editor.init();
	Entry.init();
});
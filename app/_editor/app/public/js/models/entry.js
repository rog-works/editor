'use strict';
class Entry {
	constructor () {
	}

	extend (entity) {
		let depth = entity.path.split('/').length;
		this.type = entity.type;
		this.path = entity.path;
		this.name = ko.observable(entity.name);
		this.icon = ko.observable(Entry.toIcon(this.type));
		this.selected = ko.observable(false);
		this.closed = ko.observable(0);
		this.edited = 'isTrue';
		this.attr = {
			dir: entity.dir,
			depth: depth
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
			APP.entry.entries.push(entry);
		});
	}

	rename () {
		let to = window.prompt('change file path', this.path);
		if (!Entry.validSavePath(to) || Entry.pathExists(to)) {
			return;
		}
		let encodePath = encodeURIComponent(this.path);
		let encodeParam = $.param({to: to});
		let url = `/entry/${encodePath}/rename?${encodeParam}`;
		$.ajax({
			url: url,
			type: 'PUT',
			dataType: 'json',
			success: (toPath) => {
				this.path = toPath;
			}
		});
	}

	delete () {
		let ok = confirm(`'${this.path}' deleted?`);
		if (!ok) {
			console.log('delete cancel');
			return;
		}
		let path = this.path;
		let url = '/entry/' + encodeURIComponent(path);
		$.ajax({
			url: url,
			type: 'DELETE',
			dataType: 'json',
			success: (deleted) => {
				let removed = APP.entry.entries.remove((self) => {
					return self.path() === path;
				});
				console.log(removed);
			}
		});
	}

	static init (id = 'entry-main') {
		let self = new EntryRoot();
		self.entries = ko.observableArray(self.entries);
		ko.applyBindings(self, document.getElementById(id));
		self.load();
		return self;
	}

	load (path = '/') {
		let param = $.param({dir: path});
		let url = `/entry?${param}`;
		$.get(url, (entities) => {
			let entries = Entry.toEntries(entities);
			APP.entry.entries.removeAll();
			for (let entry of entries) {
				APP.entry.entries.push(entry);
			}
			APP.entry.entries.push(new EntryAdd());
		});
	}

	static validSavePath (path) {
		if (typeof path !== 'string' || path.length === 0) {
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
		for (let entry of APP.entry.entries()) {
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

	static toIcon (type) {
		const classes = {
			file: 'glyphicon-option-vertical',
			directory: 'glyphicon-folder-open',
			// XXX
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
			type: 'file',
			path: '',
			name: '- create file -',
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
			APP.editor.load(entity.path, entity.content);
			this.activate();
		});
	}

	activate () {
		for (let entry of APP.entry.entries()) {
			if (entry.selected()) {
				entry.selected(false);
				break;
			}
		}
		this.selected(!this.selected());
	}

	click () {
		this.load(this.path);
	}
}

class EntryDirectory extends Entry {
	constructor (entity) {
		super();
		super.extend(entity);
		this.expanded = true;
	}

	toggle (dir, expanded) {
		for (let entry of APP.entry.entries()) {
			if (entry.attr.dir.startsWith(dir)) {
				if (expanded && entry.closed() > 0) {
					entry.closed(entry.closed() - 1);
				} else if (!expanded) {
					entry.closed(entry.closed() + 1);
				}
			}
		}
	}

	click () {
		this.expanded = !this.expanded;
		let nextIcon = Entry.toIcon(this.expanded ? 'directory' : 'directoryClose');
		this.icon(nextIcon);
		this.toggle(this.path, this.expanded);
	}
}

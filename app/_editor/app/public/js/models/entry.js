'use strict';

class Entry {
	constructor () {
	}

	extend (entity) {
		const depth = entity.path.split('/').length;
		this.type = entity.type;
		this.path = entity.path;
		this.name = ko.observable(entity.name);
		this.icon = ko.observable(Entry.toIcon(this.type));
		this.selected = ko.observable(false);
		this.closed = ko.observable(0);
		this.edited = true;
		this.attr = {
			dir: entity.dir,
			depth: depth
		};
	}

	static send (url, data, callback) {
		const _data = {
			url: `/entry${url}`,
			type: 'GET',
			dataType: 'json',
			success: callback,
			error: (res, err) => {
				console.log(err, res.status, res.statusText, res.responseText);
			}
		};
		$.ajax($.extend(_data, data));
	}

	static update (path, content) {
		const url = '/' + encodeURIComponent(path);
		Entry.send(url, {type: 'PUT', data: {content: content}}, (entity) => {
			// XXX
			alert(`${path} entry updated!`);
			console.log(entity);
		});
	}

	static create (path) {
		Entry.send('/', {type: 'POST', data: {path: path}}, (entity) => {
			const entry = Entry.factory(entity);
			APP.entry.entries.push(entry);
		});
	}

	rename () {
		// XXX
		const to = window.prompt('change file path', this.path);
		if (!Entry.validSavePath(to) || Entry.pathExists(to)) {
			return;
		}
		const encodePath = encodeURIComponent(this.path);
		const encodeTo = encodeURIComponent(to);
		const url = `/${encodePath}/rename?to=${encodeTo}`;
		Entry.send(url, {type: 'PUT'}, (toPath) => {
			this.path = toPath;
		});
	}

	delete () {
		// XXX
		const ok = confirm(`'${this.path}' deleted?`);
		if (!ok) {
			console.log('delete cancel');
			return;
		}
		const prev = this.path;
		const url = '/' + encodeURIComponent(prev);
		Entry.send(url, {type: 'DELETE'}, (deleted) => {
			const removed = APP.entry.entries.remove((self) => {
				return self.path === prev;
			});
			console.log(removed);
		});
	}

	static init (id = 'entry-main') {
		const self = new EntryRoot();
		self.entries = ko.observableArray(self.entries);
		ko.applyBindings(self, document.getElementById(id));
		self.load();
		return self;
	}

	load (dir = '/') {
		const url = '/?dir=' + encodeURIComponent(dir);
		Entry.send(url, {}, (entities) => {
			APP.entry.entries.removeAll();
			for (const entry of Entry.toEntries(entities)) {
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
		for (const entry of APP.entry.entries()) {
			if (entry.path === path) {
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
		this.edited = false;
	}

	click () {
		const path = window.prompt('input create file path', '/');
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
		const url = '/' + encodeURIComponent(path);
		Entry.send(url, {}, (entity) => {
			// XXX auto closing to focus editor
			$('#menu-xs-close').click();
			APP.editor.load(entity.path, entity.content);
			this.activate();
		});
	}

	activate () {
		for (const entry of APP.entry.entries()) {
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
		for (const entry of APP.entry.entries()) {
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
		const nextIcon = Entry.toIcon(this.expanded ? 'directory' : 'directoryClose');
		this.icon(nextIcon);
		this.toggle(this.path, this.expanded);
	}
}

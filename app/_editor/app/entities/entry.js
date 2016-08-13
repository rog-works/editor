'use strict';

let FileProvider = require('../helpers/fileprovider');
let Path = require('path');

/** type defines */
const TYPE_FILE = 'file';
const TYPE_DIRECTORY = 'directory';

/** root directory */
const ROOT_DIRECTORY = '/opt/app';

class Entry {
	/**
	 * Create entry
	 * @param string realPath Entry real path
	 * @param strring type Entry type
	 * @param string content Entry content
	 * @return Entry Entry
	 */
	constructor (realPath, type, content) {
		let relPath = Entry._toRelativePath(realPath);
		this.name = Path.basename(realPath);
		this.path = relPath;
		this.dir = Path.dirname(relPath);
		this.type = type;
		this.content = content;
	}

	/** Entry keys */
	static keys () {
		return ['name', 'path', 'dir', 'type', 'content'];
	}
	
	/**
	 * Get all entries from '/opt/app'
	 * @param string relDirPath Target directory relative path from '/opt/app'
	 * @return Entry[] entries
	 */
	static entries (relDirPath = '') {
		try {
			let realDirPath = Entry._toRealPath(relDirPath);
			return FileProvider.entries(realDirPath, false).map((self) => {
				let relPath = Entry._toRelativePath(self);
				let type = Entry._getType(self);
				return new Entry(self, type, '');
			});
		} catch (error) {
			console.error(error);
			return [];
		}
	}
	
	/**
	 * Find at entry
	 * @param string relPath Entry relative path from '/opt/app'
	 * @return Entry/Entry[]/null Return of Entry is file. or Entries is directory
	 */
	static at (relPath) {
		try {
			let realPath = Entry._toRealPath(relPath);
			let type = Entry._getType(realPath);
			if (type === TYPE_FILE) {
				let content = FileProvider.at(realPath);
				return new Entry(realPath, type, content);
			} else {
				// XXX
				return Entry.entries(relPath);
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	
	/**
	 * Create by path
	 * @param string relPath Entry relative path from '/opt/app'
	 * @return Entry/null Entry or null
	 */
	static create (relPath) {
		try {
			let realPath = Entry._toRealPath(relPath);
			FileProvider.create(realPath, '');
			return new Entry(realPath, TYPE_FILE, '');
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	
	/**
	 * Update by path and content body
	 * @param string relPath Entry relative path from '/opt/app'
	 * @param string content Entry content body
	 * @return Entry/null Entry or null
	 */
	static update (relPath, content) {
		try {
			let realPath = Entry._toRealPath(relPath);
			FileProvider.update(realPath, content);
			return new Entry(realPath, TYPE_FILE, content);
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	
	/**
	 * Rename by path and to path
	 * @param string relPath Entry relative path from '/opt/app'
	 * @param string relToPath Entry to relative path
	 * @return string/null Rename path or null
	 */
	static rename (relPath, relToPath) {
		try {
			FileProvider.rename(Entry._toRealPath(relPath), Entry._toRealPath(relToPath));
			return relToPath;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	
	/**
	 * Destroy by path
	 * @param string relPath Entry relative path from '/opt/app'
	 * @return boolean Destroy result
	 */
	static destroy (relPath) {
		try {
			FileProvider.remove(Entry._toRealPath(relPath));
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
	
	
	/**
	 * Get entry type
	 * @param string realPath Entity real path
	 * @return string entry type of 'file' or 'directory'
	 */
	static _getType (realPath) {
		return FileProvider.isFile(realPath) ? TYPE_FILE : TYPE_DIRECTORY;
	}
	
	/**
	 * Relative path to real path
	 * @param string relPath Entry relative path
	 * @return string Real path
	 */
	static _toRealPath (relPath) {
		return ROOT_DIRECTORY + relPath;
	}
	
	/**
	 * Real path to Relative path
	 * @param string realPath Entry real path
	 * @return string Relative path
	 */
	static _toRelativePath (realPath) {
		return realPath.substr(ROOT_DIRECTORY.length);
	}
}

module.exports = Entry;

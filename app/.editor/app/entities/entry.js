'use strict';

let FileProvider = require('../helpers/fileprovider');
let Path = require('path');

/** type defines */
const TYPE_FILE = 'file';
const TYPE_DIRECTORY = 'directory';

/** root directory */
const ROOT_DIRECTORY = '/opt/app';

/** Entry entity keys */
let keys = () => {
	return ['name', 'path', 'dir', 'type', 'content'];
};

/**
 * get all entry paths from '/opt/app'
 * @param string relDirPath Target directory relative path from '/opt/app'
 * @return string[] entry paths
 */
let entries = (relDirPath = '') => {
	try {
		let realDirPath = _toRealPath(relDirPath);
		return FileProvider.entries(realDirPath, false).map((self) => {
			let relPath = _toRelativePath(self);
			let type = _getType(self);
			return _toEntity(self, type, '');
		});
	} catch (error) {
		console.log(error);
		return [];
	}
};

/**
 * Find at entry
 * @param string relPath Entry relative path from '/opt/app'
 * @return Entry/Entry[] Return of Entry is File. or Entries is Directory
 */
let at = (relPath) => {
	try {
		let realPath = _toRealPath(relPath);
		let type = _getType(realPath);
		if (type === 'file') {
			let content = FileProvider.at(realPath);
			return _toEntity(realPath, type, content);
		} else {
			// XXX
			return entries(relPath);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Create by path and content body
 * @param string relPath Entry relative path from '/opt/app'
 * @return Entry Entry entity
 */
let create = (relPath) => {
	try {
		let realPath = _toRealPath(relPath);
		FileProvider.create(realPath, '');
		return _toEntity(realPath, TYPE_FILE, '');
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Update by path and content body
 * @param string relPath Entry relative path from '/opt/app'
 * @param string entry Entry content body
 * @return Entry Entry entity
 */
let update = (relPath, content) => {
	try {
		let realPath = _toRealPath(relPath);
		FileProvider.update(realPath, content);
		return _toEntity(realPath, TYPE_FILE, content);
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Rename by path to
 * @param string relPath Entry relative path from '/opt/app'
 * @param string relToPath Entry to relative path
 * @return string/null Rename path or null
 */
let rename = (relPath, relToPath) => {
	try {
		FileProvider.rename(_toRealPath(relPath), _toRealPath(relToPath));
		return relToPath;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Destroy by path
 * @param string relPath Entry relative path from '/opt/app'
 * @return boolean Destroy action result
 */
let destroy = (relPath) => {
	try {
		FileProvider.remove(_toRealPath(relPath));
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};


/**
 * Get entry type
 * @param string realPath Entity real path
 * @return string entry type of 'file' or 'directory'
 */
let _getType = (realPath) => {
	return FileProvider.isFile(realPath) ? TYPE_FILE : TYPE_DIRECTORY;
};

/**
 * Relative path to real path
 * @param string relPath Entry relative path
 * @return string Real path
 */
let _toRealPath = (relPath) => {
	return ROOT_DIRECTORY + relPath;
}

/**
 * Real path to Relative path
 * @param string realPath Entry real path
 * @return string Relative path
 */
let _toRelativePath = (realPath) => {
	return realPath.substr(ROOT_DIRECTORY.length);
};

/**
 * Entry to Entity
 * @param string realPath Entry real path
 * @param strring type Entry type
 * @param string content Entry content body
 * @return Entry Entry entity
 */
let _toEntity = (realPath, type, content) => {
	let relPath = _toRelativePath(realPath);
	return {
		name: Path.basename(realPath),
		path: relPath,
		dir: Path.dirname(relPath),
		type: type,
		content: content
	};
}

module.exports = {
	keys: keys,
	entries: entries,
	at: at,
	create: create,
	update: update,
	rename: rename,
	destroy: destroy
};
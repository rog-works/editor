'use strict';

let FileProvider = require('../helpers/fileprovider');
let Path = require('path');

/** type defines */
const TYPE_FILE = 'file';
const TYPE_DIRECTORY = 'directory';

/** root directory */
const ROOT_DIRECTORY = '/opt/app/works';

/** Entry entity keys */
let keys = () => {
	return ['path', 'type', 'content'];
};

/**
 * get all entry paths from '/opt/app/works'
 * @return string[] entry paths
 */
let entries = () => {
	try {
		return FileProvider.entries(ROOT_DIRECTORY).map((path) => {
			let type = FileProvider.isFile(path) ? TYPE_FILE : TYPE_DIRECTORY;
			return toEntity(path, type, '');
		});
	} catch (error) {
		console.log(error);
		return [];
	}
};

/**
 * Find at entry
 * @param string path Entry path
 * @return Entry Entry entity
 */
let at = (path) => {
	try {
		let content = FileProvider.at(path);
		let type = FileProvider.isFile(path) ? TYPE_FILE : TYPE_DIRECTORY;
		return toEntiry(path, type, content);
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Create by path and content body
 * @param string path Entry path
 * @param string entry Entry content body
 * @return Entry Entry entity
 */
let create = (path, content) => {
	try {
		FileProvider.create(path, content);
		return toEntity(path, TYPE_FILE, content);
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Update by path and content body
 * @param string path Entry path
 * @param string entry Entry content body
 * @return Entry Entry entity
 */
let update = (path, content) => {
	try {
		FileProvider.update(path, content);
		return toEntity(path, TYPE_FILE, content);
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Rename by path to
 * @param string path Entry from path
 * @param string to Entry to path
 * @return boolean Rename action result
 */
let rename = (path, to) => {
	try {
		FileProvider.rename(path, to);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

/**
 * Destroy by path
 * @param string path Entry path
 * @return boolean Destroy action result
 */
let destroy = (path) => {
	try {
		FileProvider.remove(path);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

/**
 * Entry to Entity
 * @param string path Entry path
 * @param string content Entry content body
 * @return Entry Entry entity
 */
let toEntity = (path, type, content) => {
	return {
		name: Path.basename(path),
		path: path,
		type: type,
		conotent: content
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
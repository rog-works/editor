'use strict';

let fs = require('fs');
let Path = require('path');
let glob = require('glob');

/**
 * get all entry paths from target directory
 * @param string directory Target directory
 * @param bool nameOnly Result to file name
 * @return string[] entry paths
 * @throws no such file or directory
 */
let entries = (directory, nameOnly = true) => {
	let entries = glob.sync(directory + '/*', {nosort: true});
	entries.sort(_sort);
	if (nameOnly) {
		return entries.map((self) => {
			return self.substr(directory.length);
		});
	}
	return entries;
};

/**
 * get file content by path
 * @param string path File path
 * @return string File content
 * @throws no such file or directory
 * @throws illegal operation on a directory, read
 */
let at = (path) => {
	return fs.readFileSync(path, 'utf8');
};

/**
 * Create by path and content body
 * @param string path File save path
 * @param string content File content body
 * @throws no such file or directory
 */
let create = (path, content) => {
	let dir = Path.dirname(path);
	if (!_exists(dir)) {
		_mkdir(dir);
	}
	fs.writeFileSync(path, content, 'utf8');
};

/**
 * Update by path and content body
 * @param string path File save path
 * @param string content File content body
 * @throws no such file or directory
 */
let update = (path, content) => {
	fs.writeFileSync(path, content, 'utf8');
};

/**
 * Rename by path to
 * @param string path File from path
 * @param string to File to path
 * @throws no such file or directory
 */
let rename = (path, to) => {
	fs.rename(path, to);
};

/**
 * Remove by path
 * @param string path File save path
 * @throws no such file or directory
 */
let remove = (path) => {
	fs.unlink(path);
};

/**
 * Checking for path is file
 * @param string path File save path
 * @throws no such file or directory
 */
let isFile = (path) => {
	try {
		let stat = fs.statSync(path);
		return stat.isFile();
	} catch (error) {
		console.log(error);
		return false;
	}
};

/**
 * Exists by path
 * @param string path File or Directory path
 * @return bool existing to true
 */
let _exists = (path) => {
	try {
		fs.statSync(path);
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Create directory by path
 * @param string path Directory path
 */
let _mkdir = (path) => {
	let dirs = path.split('/');
	let curr = '';
	for (let dir of dirs) {
		curr += '/' + dir;
		if (!_exists(curr)) {
			fs.mkdirSync(curr);
		}
	}
};

/**
 * entry sorter
 * @param string a target a
 * @param string b target b
 * @return int string comparation
 */
let _sort = (a, b) => {
	let aIsFile = isFile(a);
	let bIsFile = isFile(b);
	let isFiles = aIsFile && bIsFile;
	let isDirs = (!aIsFile) && (!bIsFile);
	if (isFiles || isDirs) {
		return a === b ? 0 : (a > b ? 1 : -1);
	} else {
		return aIsFile ? 1 : -1;
	}
};

module.exports = {
	entries: entries,
	at: at,
	create: create,
	update: update,
	rename: rename,
	remove: remove,
	isFile: isFile
};

'use strict';

let fs = require('fs');
let Path = require('path');

/**
 * get all entry paths from target directory
 * @param string directory Target directory
 * @return string[] entry paths
 * @throws no such file or directory
 */
let entries = (directory) => {
	return fs.readdirSync(directory);
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
 * @param string file File content body
 * @throws no such file or directory
 */
let create = (path, content) => {
	let dir = Path.dirname(path);
	if (!exists(dir)) {
		mkdir(dir);
	}
	fs.writeFileSync(path, content, 'utf8');
};

/**
 * Update by path and content body
 * @param string path File save path
 * @param string file File content body
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
let exists = (path) => {
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
let mkdir = (path) => {
	let dirs = path.split('/');
	let curr = '';
	for (let dir of dirs) {
		curr += '/' + dir;
		if (!exists(curr)) {
			fs.mkdirSync(curr);
		}
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

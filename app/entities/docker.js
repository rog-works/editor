'use strict';

let ProcessProvider = require('../helpers/processprovider');
let docker = new ProcessProvider('docker');

/** result keys */
let keys = () => {
	return ['command', 'output', 'status'];
};

/**
 * Execution to 'docker info <container-id>'
 * @param string containerId container id
 * @return ProcessResult result
 */
let info = (containerId) => {
	let builder = docker.command('info')
		.require(containerId);
	return execProxy(builder);
};

/**
 * Execution to 'docker ps [-a] [status=exited]'
 * @param object options Option args. format: {'all': any, 'exited': any}
 * @return ProcessResult result
 */
let ps = (options = {}) => {
	let builder = docker.command('ps')
		.option('-a', 'all' in option)
		.option('status=exited', 'exited' in options);
	return execProxy(builder);
};

/**
 * Execution to 'docker images [-a] [dangling=true]'
 * @param object options Option args. format: {'all': any, 'dangling': any}
 * @return ProcessResult result
 */
let images = (options = {}) => {
	let builder = docker.command('images')
		.option('-a', 'all' in option)
		.option('dangling=true', 'dangling' in options);
	return execProxy(builder);
};

/**
 * Execution to 'docker rm <container-id>'
 * @param string containerId container id
 * @return ProcessResult result
 */
let rm = (containerId) {
	let builder = docker.command('rm')
		.require(containerId);
	return execProxy(builder);
};

/**
 * Execution to 'docker rmi <image-id>'
 * @param string imageId image id
 * @return ProcessResult result
 */
let rmi = (imageId) {
	let builder = docker.command('rmi')
		.require(imageId);
	return execProxy(builder);
};

/**
 * Execution to 'docker <command> [options...]'
 * @param string command Docker command
 * @param string[] Command arguments
 * @return ProcessResult result
 */
let command = (command, args) => {
	let builder = docker.command(command);
	for (let arg of args) {
		builder.arg(arg);
	}
	return execProxy(builder);
};

/**
 * Execution to result
 * @param CommandBuilder builder Process command builder
 * @return ProcessResult result
 */
let execProxy = (builder) => {
	let command = builder.command();
	let output = builder.exec();
	let status = builder.status();
	return {
		command: command,
		output: output,
		status: status
	};
};

module.exports = {
	info: info,
	ls: ls,
	ps: ps,
	images: images,
	rm: rm,
	rmi: rmi,
	command: command
};
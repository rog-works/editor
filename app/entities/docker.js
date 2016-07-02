'use strict';

let ProcessProvider = require('../helpers/processprovider');
let docker = new ProcessProvider('docker');

/** File entity keys */
let keys = () => {
	return ['command', 'output', 'status'];
};

/**
 * Execution by 'docker info <container-id>'
 * @param string container id
 * @return Process Process entity
 */
let info = (containerId) => {
	let builder = docker.command('info')
		.require(containerId);
	return execProxy(builder);
};

/**
 * Execution by 'docker ps [-a] [status=exited]'
 * @param object Option args object. require {'all': any, 'exited': any}
 * @return Process Process entity
 */
let ps = (options = {}) => {
	let builder = docker.command('ps')
		.option('-a', 'all' in option)
		.option('status=exited', 'exited' in options);
	return execProxy(builder);
};

/**
 * Execution by 'docker images [-a] [dangling=true]'
 * @param object Option args object. require {'all': any, 'dangling': any}
 * @return Process Process entity
 */
let images = (options = {}) => {
	let builder = docker.command('images')
		.option('-a', 'all' in option)
		.option('dangling=true', 'dangling' in options);
	return execProxy(builder);
};

/**
 * Execution by 'docker rm <container-id>'
 * @param string container id
 * @return Process Process entity
 */
let rm = (containerId) {
	let builder = docker.command('rm')
		.require(containerId);
	return execProxy(builder);
};

/**
 * Execution by 'docker rmi <image-id>'
 * @param string image id
 * @return Process Process entity
 */
let rmi = (imageId) {
	let builder = docker.command('rmi')
		.require(imageId);
	return execProxy(builder);
};

/**
 * Execution by 'docker <command> [options...]'
 * @param string command Docker command
 * @param string[] Command arguments
 * @return Process Process entity
 */
let command = (command, args) => {
	let builder = docker.command(command);
	for (let arg of args) {
		builder.arg(arg);
	}
	return execProxy(builder);
};

/**
 * Execution proxy
 * @param CommandBuilder builder Docker command builder
 * @return Process Process entity
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
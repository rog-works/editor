'use strict';

let ProcessProvider = require('../helpers/processprovider');
let docker = new ProcessProvider('docker');

/** result keys */
let keys = () => {
	return ['query', 'output', 'status'];
};

/**
 * Execution to 'service docker start'
 * @return ProcessResult result
 */
let start = () => {
	let builder = (new ProcessProvider('service')).add('docker').add('start');
	return execProxy(builder);
};

/**
 * Execution to 'docker info <container-id>'
 * @param string containerId container id
 * @return ProcessResult result
 */
let info = (containerId) => {
	let builder = docker.command('info').add(containerId);
	return execProxy(builder);
};

/**
 * Execution to 'docker ps [-a] [status=exited]'
 * @param object options Option args. format: {'all': any, 'exited': any}
 * @return ProcessResult result
 */
let ps = (options = {}) => {
	let builder = docker.command('ps')
		.add('-a', !!options.all)
		.add('status=exited', !!options.exited);
	return execProxy(builder);
};

/**
 * Execution to 'docker images [-a] [dangling=true]'
 * @param object options Option args. format: {'all': any, 'dangling': any}
 * @return ProcessResult result
 */
let images = (options = {}) => {
	let builder = docker.command('images')
		.add('-a', !!options.all)
		.add('dangling=true', !!options.dangling);
	return execProxy(builder);
};

/**
 * Execution to 'docker rm <container-id>'
 * @param string containerId container id
 * @return ProcessResult result
 */
let rm = (containerId) => {
	let builder = docker.command('rm').add(containerId);
	return execProxy(builder);
};

/**
 * Execution to 'docker rmi <image-id>'
 * @param string imageId image id
 * @return ProcessResult result
 */
let rmi = (imageId) => {
	let builder = docker.command('rmi').add(imageId);
	return execProxy(builder);
};

/**
 * Execution to 'docker rmi <image-id>'
 * @param string image Docker image name
 * @param string tag image tag
 * @return ProcessResult result
 */
let pull = (image, tag = 'latest') => {
	let builder = docker.command('pull').add(`${image}:${tag}`);
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
		builder.add(arg);
	}
	return execProxy(builder);
};

/**
 * Execution to result
 * @param CommandBuilder builder Process command builder
 * @return ProcessResult result
 */
let execProxy = (builder) => {
	let query = builder.build();
	let output = builder.exec();
	let status = builder.status();
	return {
		query: query,
		output: output,
		status: status
	};
};

module.exports = {
	info: info,
	ps: ps,
	images: images,
	rm: rm,
	rmi: rmi,
	pull: pull,
	command: command
};
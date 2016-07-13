'use strict';

let ProcessProvider = require('../helpers/processprovider');

/** result keys */
let keys = () => {
	return ['query', 'output', 'status'];
};

/**
 * Execution to 'docker <command> [options...]'
 * @param string command Docker command
 * @param string[] Command arguments
 * @return ProcessResult result
 */
let command = (command, args) => {
	let builder = new ProcessProvider(command);
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
	keys: keys,
	command: command
};
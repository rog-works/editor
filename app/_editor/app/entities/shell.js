'use strict';

let ProcessProvider = require('../helpers/processprovider');

/** current working directory */
const CURRENT_DIR = '/opt/app';

/** stdout */
const LOG_PATH = '/var/log/app/editor-shell.log';

class Shell {
	/**
	 * Create instance
	 */
	constructor () {
		this._stdout = require('fs').createWriteStream(LOG_PATH);
		this._options = {
			cwd: CURRENT_DIR
		};
	}

	/**
	 * Execution to '<command> [argument...]'
	 * @param string command command name
	 * @param string[] Command arguments
	 * @return bool Execution result
	 */
	run (command, args) {
		let self = this;
		return (new ProcessProvider(command))
			.add(args)
			.option(this._options)
			.on('stdout', (data) => { self._onStdout(data); })
			.on('stderr', (data) => { self._onStderr(data); })
			.run();
	}

	/**
	 * Stdout event handler
	 * @param string data output stdout
	 */
	_onStdout (data) {
		this._stdout.write(data);
	}

	/**
	 * Stderr event handler
	 * @param string data output stderr
	 */
	_onStderr (data) {
		this._stdout.write(data);
	}
}

module.exports = Shell;
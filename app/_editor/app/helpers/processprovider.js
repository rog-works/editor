'use strict';

const LOG_PATH = '/var/log/app/editor-shell.log';
const spawn = require('child_process').spawn;
const stdout = require('fs').createWriteStream(LOG_PATH);

class ProcessProvider {
	/**
	 * Create instance
	 * @param string command target command
	 */
	constructor (command) {
		this._command = command;
		this._args = [];
		this._lastExecStatus = 'idle';
	}

	/**
	 * Added argument
	 * @param bool available Added condition
	 * @param string arg argument
	 * @return ProcessProvider this
	 */
	add (arg, available = true) {
		if (available) {
			this._args.push(arg);
		}
		return this;
	}

	/**
	 * Query build
	 * @return string Executed query
	 */
	build () {
		let args = this._args.join(' ');
		return `${this._command} ${args}`;
	}

	/**
	 * Executed status
	 * @return string Executed status
	 */
	status () {
		return this._lastExecStatus;
	}

	/**
	 * Query executed
	 * @return string output
	 */
	exec () {
    	console.log('executed', this._command, this._args);
        let child = spawn(this._command, this._args);
        child.stdout.on('data', (data) => {
            stdout.write(data); 
		    this._lastExecStatus = 'success';
        });
        child.stderr.on('data', (data) => {
            stdout.write(data);
	    	this._lastExecStatus = 'error';
        });
		return 'success';
	}
}

module.exports = ProcessProvider;

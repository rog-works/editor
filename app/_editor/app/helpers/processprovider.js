'use strict';

let execSync = require('child_process').execSync;

class ProcessProvider {
	/**
	 * Create instance
	 * @param string _app target application
	 */
	constructor (_app) {
		this._app = _app;
		this._command = '';
		this._args = [];
		this._lastExecStatus = 'idle';
	}

	/**
	 * Build command
	 * @param string _command Executed command
	 * @return ProcessProvider this
	 */
	command (_command) {
		this._command = _command;
		return this;
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
		return `${this._app} ${this._command} ${args}`;
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
		let query = this.build();
		let options = {
				cwd: '/opt/app/',
				encoding: 'utf8'
			};
		console.log('executed. ' + query);
		try {
			let result = execSync(query, options);
			this._lastExecStatus = 'success';
			return result;
		} catch (error) {
			console.log(error);
			this._lastExecStatus = 'failure';
			return '';
		}
	}
}

module.exports = ProcessProvider;

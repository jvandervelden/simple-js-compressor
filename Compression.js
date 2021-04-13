'use strict';

module.exports = class Compression {
	constructor(abbreviations) {
		this.abbreviations = abbreviations;
		this.expansions = Object.entries(abbreviations).reduce((acc, [key, val]) => {
			acc[val] = key;
			return acc;
		}, {});
	}

	_isObject(arg) {
		return typeof arg === 'object' && arg !== null;
	}

	compact(arg) {
		if (typeof arg === 'string') {
			const abbreviation = this.abbreviations[arg];
			if (abbreviation) {
				return abbreviation;
			}
		} else if (Array.isArray(arg)) {
			return arg.map((val) => this.compact(val));
		} else if (this._isObject(arg)) {
			return Object.entries(arg).reduce((acc, [key, val]) => {
				acc[this.compact(key)] = this._isObject(val) ? this.compact(val) : val;
				return acc;
			}, {});
		}

		return arg;
	}

	expand(arg) {
		if (typeof arg === 'string') {
			const expansion = this.expansions[arg];
			if (expansion) {
				return expansion;
			}
		} else if (Array.isArray(arg)) {
			return arg.map((val) => this.expand(val));
		} else if (this._isObject(arg)) {
			return Object.entries(arg).reduce((acc, [key, val]) => {
				acc[this.expand(key)] = this._isObject(val) ? this.expand(val) : val;
				return acc;
			}, {});
		}

		return arg;
	}
};

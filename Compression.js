'use strict';

module.exports = class Compression {
	constructor(abbreviations, { maxDepth = -1 } = {}) {
		this.maxDepth = maxDepth;
		this.abbreviations = abbreviations;
		this.expansions = Object.entries(abbreviations).reduce((acc, [key, val]) => {
			acc[val] = key;
			return acc;
		}, {});
	}

	_isObject(arg) {
		return typeof arg === 'object' && arg !== null;
	}

	compact(arg, depth = 0) {
		if (this.maxDepth !== -1 && depth > this.maxDepth) {
			return arg;
		}

		if (typeof arg === 'string') {
			const abbreviation = this.abbreviations[arg];
			if (abbreviation) {
				return abbreviation;
			}
		} else if (Array.isArray(arg)) {
			return arg.map((val) => this.compact(val, depth));
		} else if (this._isObject(arg)) {
			return Object.entries(arg).reduce((acc, [key, val]) => {
				acc[this.compact(key, depth)] = this._isObject(val) ? this.compact(val, depth + 1) : val;
				return acc;
			}, {});
		}

		return arg;
	}

	expand(arg, depth = 0) {
		if (this.maxDepth !== -1 && depth > this.maxDepth) {
			return arg;
		}

		if (typeof arg === 'string') {
			const expansion = this.expansions[arg];
			if (expansion) {
				return expansion;
			}
		} else if (Array.isArray(arg)) {
			return arg.map((val) => this.expand(val, depth));
		} else if (this._isObject(arg)) {
			return Object.entries(arg).reduce((acc, [key, val]) => {
				acc[this.expand(key, depth)] = this._isObject(val) ? this.expand(val, depth + 1) : val;
				return acc;
			}, {});
		}

		return arg;
	}
};

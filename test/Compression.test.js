'use strict';

var chai = require('chai');
chai.should();

const { expect } = chai;

const Compression = require('../Compression');

describe('Compression', function() {
	const abbreviationMap = {
		attr1: 'a',
		test2: 't',
		value3: 'v',
	};

	beforeEach(function() {
		this.compression = new Compression(abbreviationMap);
	});

	describe('compact', function() {
		it('should compact object keys that exist in the abreviation map', function() {
			this.compression.compact({
				attr1: 'some value',
				test2: 'another value',
			}).should.deep.equal({
				a: 'some value',
				t: 'another value',
			});
		});

		it('should compact sub object keys that exist in the abreviation map', function() {
			this.compression.compact({
				attr1: {
					test2: 'some value',
				},
			}).should.deep.equal({
				a: {
					t: 'some value',
				},
			});
		});

		it('should compact sub arrays that exist in the abreviation map', function() {
			this.compression.compact({
				attr1: ['value3'],
			}).should.deep.equal({
				a: ['v'],
			});
		});

		it('should compact array values that exist in the abreviation map', function() {
			this.compression.compact(['value3', 'value4']).should.deep.equal(['v', 'value4']);
		});

		it('should compact sub objects in an array that exist in the abreviation map', function() {
			this.compression.compact([{
				attr1: {
					test2: 'some value',
				},
			}]).should.deep.equal([{
				a: {
					t: 'some value',
				},
			}]);
		});

		it('should not compact non object, array, or string values', function() {
			expect(this.compression.compact(null)).to.be.null;
			expect(this.compression.compact(undefined)).to.be.undefined;
			this.compression.compact(1234).should.equal(1234);
			this.compression.compact(true).should.equal(true);
		});
	});

	describe('expand', function() {
		it('should expand object keys that exist in the abreviation map', function() {
			this.compression.expand({
				a: 'some value',
				t: 'another value',
			}).should.deep.equal({
				attr1: 'some value',
				test2: 'another value',
			});
		});

		it('should expand sub object keys that exist in the abreviation map', function() {
			this.compression.expand({
				a: {
					t: 'some value',
				},
			}).should.deep.equal({
				attr1: {
					test2: 'some value',
				},
			});
		});

		it('should expand sub arrays that exist in the abreviation map', function() {
			this.compression.expand({
				a: ['v'],
			}).should.deep.equal({
				attr1: ['value3'],
			});
		});

		it('should expand array values that exist in the abreviation map', function() {
			this.compression.expand(['v', 'value4']).should.deep.equal(['value3', 'value4']);
		});

		it('should expand sub objects in an array that exist in the abreviation map', function() {
			this.compression.expand([{
				a: {
					t: 'some value',
				},
			}]).should.deep.equal([{
				attr1: {
					test2: 'some value',
				},
			}]);
		});

		it('should not expand non object, array, or string values', function() {
			expect(this.compression.expand(null)).to.be.null;
			expect(this.compression.expand(undefined)).to.be.undefined;
			this.compression.expand(1234).should.equal(1234);
			this.compression.expand(true).should.equal(true);
		});
	});
});

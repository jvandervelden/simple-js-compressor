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
	
	describe('compact', function() {
		it('should compact object keys that exist in the abreviation map', function() {
			new Compression(abbreviationMap).compact({
				attr1: 'some value',
				test2: 'another value',
			}).should.deep.equal({
				a: 'some value',
				t: 'another value',
			});
		});

		it('should compact sub object keys that exist in the abreviation map', function() {
			new Compression(abbreviationMap).compact({
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
			new Compression(abbreviationMap).compact({
				attr1: ['value3'],
			}).should.deep.equal({
				a: ['v'],
			});
		});

		it('should compact array values that exist in the abreviation map', function() {
			new Compression(abbreviationMap).compact(['value3', 'value4']).should.deep.equal(['v', 'value4']);
		});

		it('should compact sub objects in an array that exist in the abreviation map', function() {
			new Compression(abbreviationMap).compact([{
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
			expect(new Compression(abbreviationMap).compact(null)).to.be.null;
			expect(new Compression(abbreviationMap).compact(undefined)).to.be.undefined;
			new Compression(abbreviationMap).compact(1234).should.equal(1234);
			new Compression(abbreviationMap).compact(true).should.equal(true);
		});

		it('should not compact after a max depth', function() {
			new Compression(abbreviationMap, { maxDepth: 1 }).compact([{
				attr1: {
					test2: {
						attr1: {
							test2: 'not compressed',
						},
					},
				},
			}]).should.deep.equal([{
				a: {
					t: {
						attr1: {
							test2: 'not compressed',
						},
					},
				},
			}]);
		});

		it('should not consider array as a depth increase', function() {
			new Compression(abbreviationMap, { maxDepth: 1 }).compact([{
				attr1: [{
					test2: {
						attr1: {
							test2: 'not compressed',
						},
					},
				}],
			}]).should.deep.equal([{
				a: [{
					t: {
						attr1: {
							test2: 'not compressed',
						},
					},
				}],
			}]);
		});
	});

	describe('expand', function() {
		it('should expand object keys that exist in the abreviation map', function() {
			new Compression(abbreviationMap).expand({
				a: 'some value',
				t: 'another value',
			}).should.deep.equal({
				attr1: 'some value',
				test2: 'another value',
			});
		});

		it('should expand sub object keys that exist in the abreviation map', function() {
			new Compression(abbreviationMap).expand({
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
			new Compression(abbreviationMap).expand({
				a: ['v'],
			}).should.deep.equal({
				attr1: ['value3'],
			});
		});

		it('should expand array values that exist in the abreviation map', function() {
			new Compression(abbreviationMap).expand(['v', 'value4']).should.deep.equal(['value3', 'value4']);
		});

		it('should expand sub objects in an array that exist in the abreviation map', function() {
			new Compression(abbreviationMap).expand([{
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
			expect(new Compression(abbreviationMap).expand(null)).to.be.null;
			expect(new Compression(abbreviationMap).expand(undefined)).to.be.undefined;
			new Compression(abbreviationMap).expand(1234).should.equal(1234);
			new Compression(abbreviationMap).expand(true).should.equal(true);
		});

		it('should not expand after a max depth', function() {
			new Compression(abbreviationMap, { maxDepth: 1 }).expand({
				a: {
					t: {
						attr1: {
							test2: 'not compressed',
						},
					},
				},
			}).should.deep.equal({
				attr1: {
					test2: {
						attr1: {
							test2: 'not compressed',
						},
					},
				},
			});
		});

		it('should not consider array as a depth increase', function() {
			new Compression(abbreviationMap, { maxDepth: 1 }).expand({
				a: [{
					t: {
						attr1: {
							test2: 'not compressed',
						},
					},
				}],
			}).should.deep.equal({
				attr1: [{
					test2: {
						attr1: {
							test2: 'not compressed',
						},
					},
				}],
			});
		});
	});
});

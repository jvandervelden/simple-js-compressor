# Simple Object Compressor

Compresses JavaScript objects by shortening all keys by an abbreviation map.

```javascript

const Compression = require('simple-object-compressor');

const compression = new Compression({
  testAttribute: 'ta',
  testValue: 'tv',
});

compression.compact({ testAttribute: ['testValue'] });
// { ta: ['tv'] }

compression.expand({ ta: ['tv'] });
// { testAttribute: ['testValue'] }

```

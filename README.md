# Simple Object Compressor

Compresses JavaScript objects by shortening all keys by an abbreviation map.

```javascript

const Compression = require('simple-object-compressor');

const compression = new Compression({
  testAttribute: 'ta',
  testValue: 'tv',
}, {
  maxDepth: -1,
});

compression.compact({ testAttribute: ['testValue'] });
// { ta: ['tv'] }

compression.expand({ ta: ['tv'] });
// { testAttribute: ['testValue'] }

```

## Options

- maxDepth {number} Default -1: Max depth to compress. Root of the object is 0. -1 is no limit. Arrays contents do not count as a depth increase.
```javascript
{
  depth0: {
    depth1: ['depth1', { depth2: {} }],
  }
}
```

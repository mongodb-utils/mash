## Mash

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Use MongoDB as a key/value store.
This is useful only for those who already use MongoDB and don't want to add another layer to their stack
or need to cache MongoDB-specific things like ObjectIDs.

## API

Documents are stored as:

```json
{
  "_id": "<key>",
  "value": "<value>",
  "expires": "<Date>",
  "created": "<Date>"
}
```

### var cache = new Mash(options)

Create a new `mash` instance.
Options are:

- `collection` - the MongoDB collection to use
- `maxAge` - default expiration age

### cache.maxAge(ms)

Set the default max age.

### cache.collection = collection

Set the MongoDB collection to use.
Does __not__ support capped collections.

### cache.set(key, value, [maxAge]).then( doc => )

Set the value. Can optionally override the default `maxAge`.

Optionally you can chain:

- `.new()` - return the doc
- `.w('majority')` - a write concern

### cache.get(key, [maxAge]).then( doc => )

Retrieve the cached value if one exists.
Optionally set a `maxAge` that overrides the one set by `.set().`

Optionally you can chain:

- `.readPreference('nearest')` - read preference

### cache.evict(key).then( => )

Evict all documents based on a `key`,
which could also be a MongoDB expression.

Optionally you can chain:

- `.w('majority')` - a write concern

### cache.ensureIndex().then( => )

Ensure the index on the curret collection.
Converts it into a TTL collection.

[gitter-image]: https://badges.gitter.im/mongodb-utils/mash.png
[gitter-url]: https://gitter.im/mongodb-utils/mash
[npm-image]: https://img.shields.io/npm/v/mash.svg?style=flat-square
[npm-url]: https://npmjs.org/package/mash
[github-tag]: http://img.shields.io/github/tag/mongodb-utils/mash.svg?style=flat-square
[github-url]: https://github.com/mongodb-utils/mash/tags
[travis-image]: https://img.shields.io/travis/mongodb-utils/mash.svg?style=flat-square
[travis-url]: https://travis-ci.org/mongodb-utils/mash
[coveralls-image]: https://img.shields.io/coveralls/mongodb-utils/mash.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/mongodb-utils/mash
[david-image]: http://img.shields.io/david/mongodb-utils/mash.svg?style=flat-square
[david-url]: https://david-dm.org/mongodb-utils/mash
[license-image]: http://img.shields.io/npm/l/mash.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/mash.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/mash
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/

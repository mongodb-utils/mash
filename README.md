## Mash

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/mash.svg?style=flat
[npm-url]: https://npmjs.org/package/mash
[travis-image]: https://img.shields.io/travis/mongodb-utils/mash.svg?style=flat
[travis-url]: https://travis-ci.org/mongodb-utils/mash
[coveralls-image]: https://img.shields.io/coveralls/mongodb-utils/mash.svg?style=flat
[coveralls-url]: https://coveralls.io/r/mongodb-utils/mash?branch=master
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat
[gittip-url]: https://www.gittip.com/jonathanong/

Use MongoDB as a key/value store.
This is useful only for those who already use MongoDB and don't want to add another layer to their stack
or need to cache MongoDB-specific things like ObjectIDs.

## API

Documents are stored as:

```json
{
  "_id": key,
  "value": value,
  "expire": Date
}
```

### var mash = require('mash')(options)

Create a new `mash` instance.
Options are:

- `collection` - the MongoDB collection to use
- `maxAge` - default expiration age in milliseconds

### mash(key, maxAge || 30000)

Create a new cache object with a given `key` and a `maxAge` in milliseconds defaulting to 30 seconds.

```js
var cache = mash('some key')
```

### mash().get()

Retrieve the cacheed value if one exists.

### mash().set(value)

Save the value with the associated key.

### mash().evict()

Delete the cache.

### mash.maxAge

Set the default `maxAge` argument for all `mash` instances.

### mash.evict(key)

Delete all documents that match the given `key`.

## MongoDB Settings

### Key types

`mash` is agnostic to the type of `key` used.
You can use strings, arrays, or objects.
Thus, if you use strings, you can also evict using regular expressions.

### Index

You'd want to create a secondary index that deletes documents based on `expire`:

```js
db.cache.ensureIndex({
  expire: -1
}, {
  expireAfterSeconds: 0
})
```

This index will expire all documents where `doc.expire > new Date()`,
keeping your collection as small as possible.

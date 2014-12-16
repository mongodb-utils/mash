
var wrap = require('mongodb-next').collection
var assert = require('assert')
var ms = require('ms')

module.exports = Mash

function Mash(options) {
  if (!(this instanceof Mash)) return new Mash(options)

  options = options || {}
  this.maxAge(options.maxAge || options.maxage || '5m')
  if (options.collection) this.collection = options.collection
}

/**
 * Lazily set the MongoDB collection.
 * Asserts when you try to use it before it's set.
 */

Object.defineProperty(Mash.prototype, 'collection', {
  set: function (collection) {
    assert(!this._collection, 'A `.collection` is already set!')
    this._collection = wrap(this.rawCollection = collection)
  },
  get: function () {
    assert(this._collection, 'Set `.collection` first!')
    return this._collection
  }
})

/**
 * Set the default max age.
 */

Mash.prototype.maxAge = function (value) {
  if (typeof value === 'string') this._maxAge = ms(value)
  if (typeof value === 'number') this._maxAge = value
  return this
}

/**
 * Set a value to a key.
 */

Mash.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this._maxAge
  if (typeof maxAge === 'string') maxAge = ms(maxAge)

  return this.collection.findOne({
    _id: key
  }).set({
    value: value,
    created: new Date(),
    expires: new Date(Date.now() + maxAge)
  }).upsert()
}

/**
 * Get latest value based on a key.
 */

Mash.prototype.get = function (key, maxAge) {
  var query = this.collection.findOne({
    _id: key,
    expires: {
      $gt: new Date()
    }
  }).sort({
    created: -1 // newest, in case `key` is not a single value
  })

  // optional max age separate from creation
  if (typeof maxAge === 'string') maxAge = ms(maxAge)
  if (typeof maxAge === 'number') {
    query.find('created', {
      $gt: Date.now() - maxAge
    })
  }

  return query
}

/**
 * Evict all caches based on a key.
 */

Mash.prototype.evict = function (key) {
  return this.collection.remove('_id', key)
}

/**
 * Create an index on this collection,
 * which basically makes sure to delete all
 * objects that have expired.
 *
 * Note that the only other index is `_id`,
 * which is already set.
 */

Mash.prototype.ensureIndexes =
Mash.prototype.ensureIndex = function () {
  return this.collection.ensureIndex({
    expires: 1
  }, {
    expireAfterSeconds: 0
  })
}


var util = require('util')
var Promise = require('bluebird')

module.exports = function (options) {
  return Mash.extend(options)
}

Mash.extend = function (options) {
  function Mash(key, maxAge) {
    if (!(this instanceof Mash))
      return new Mash(key, maxAge)

    this._init(key, maxAge)
  }

  util.inherits(Mash, this)

  Object.keys(this).forEach(function (key) {
    Mash[key] = this[key]
  }, this)

  Object.keys(options || {}).forEach(function (key) {
    Mash[key] = options[key]
  }, this)

  return Mash
}

// Defaults
Mash.maxAge = 30000

/*

  @key = string, array, or object (no nested objects)
  @maxAge = ms until cache expires

*/
function Mash() {}

// Will evict all keys that has this key
// ie evicting `user_followers` will evict `user_followers_new` as well
Mash.evict = function (key) {
  var collection = this.collection

  return new Promise(function (resolve, reject) {
    collection.remove({
      _id: key
    }, function (err) {
      if (err) reject(err)
      else resolve()
    })
  })
}

Mash.prototype._init = function (key, maxAge) {
  this.key = key
  this.maxAge = typeof maxAge === 'number'
    ? maxAge
    : this.constructor.maxAge
}

Mash.prototype.get = function () {
  var collection = this.constructor.collection
  var key = this.key

  return new Promise(function (resolve, reject) {
    collection.findOne({
      _id: key,
      expire: {
        $gt: new Date()
      }
    }, function (err, doc) {
      if (err) reject(err)
      else if (doc) resolve(doc.value)
      else resolve()
    })
  })
}

Mash.prototype.set = function (value, maxAge) {
  maxAge = maxAge || this.maxAge
  var collection = this.constructor.collection
  var key = this.key

  return new Promise(function (resolve, reject) {
    collection.findAndModify({
      _id: key
    }, [/* sort */], {
      _id: key,
      value: value,
      expire: new Date(Date.now() + maxAge),
    }, {
      upsert: true
    }, function (err) {
      if (err) reject(err)
      else resolve()
    })
  })
}

Mash.prototype.evict = function () {
  return this.constructor.evict(this.key)
}

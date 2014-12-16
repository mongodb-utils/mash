
var Promise = require('bluebird')
var assert = require('assert')

var Mash = require('..')

var currentDate = Date.now()
var cache = new Mash()
var db

describe('Mash', function () {
  before(function (done) {
    require('mongodb').MongoClient.connect('mongodb://localhost/mashtest', function (err, _db) {
      assert.ifError(err)
      db = _db
      db.dropDatabase(done)
    })
  })

  it('should ensure indexes', function () {
    cache.collection = db.collection('klajsdlfkjasdf')
    return cache.ensureIndex()
  })

  it('should get and set', function () {
    return cache.set('asdf', currentDate).then(function () {
      return cache.get('asdf')
    }).then(function (doc) {
      assert(doc)
      assert.equal(currentDate, doc.value)

      return cache.evict('asdf')
    }).then(function () {
      return cache.get('asdf')
    }).then(function (val) {
      assert(!val)
    })
  })

  it('should support .get(key, [maxAge])', function () {
    return cache.set('qwer', new Date()).then(function () {
      return cache.get('qwer', -1)
    }).then(function (job) {
      assert(!job)
    })
  })

  it('should evict', function () {
    return cache.set('123', Date.now()).then(function () {
      return cache.evict('123')
    }).then(function () {
      return cache.collection.findOne({
        _id: '123'
      }).count()
    }).then(function (count) {
      assert(!count)
    })
  })
})

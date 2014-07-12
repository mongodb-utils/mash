
var Promise = require('bluebird')
var assert = require('assert')

var Mash = require('./')

var currentDate = Date.now()

describe('Mash', function () {
  it('should connect to MongoDB', function (done) {
    require('mongodb').MongoClient.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {auto_reconnect: true
      }, function (err, db) {
        assert.ifError(err)
        assert.ok(db)

        db.collection('mash', function (err, collection) {
          assert.ifError(err)
          assert.ok(collection)

          Mash = Mash({
            collection: collection
          })

          done()
        })
      }
    )
  })

  it('should get and set', function () {
    var cache = new Mash('set_get', 1000)

    return cache.set(currentDate).then(function (val) {
      assert.equal(currentDate, val)
      return cache.get()
    }).then(function (val) {
      assert(val)
      assert.equal(currentDate, val)

      return cache.evict()
    }).then(function () {
      return cache.get()
    }).then(function (val) {
      assert(!val)
    })
  })

  it('should evict', function () {
    var cache = new Mash('evict', 1000)

    return cache.set(Date.now()).then(function () {
      return Mash.evict('evict')
    }).then(function () {
      return new Promise(function (resolve, reject) {
        Mash.collection.findOne({
          _id: 'evict'
        }, function (err, doc) {
          if (err) reject(err)
          else if (doc) reject(new Error('doc exists'))
          else resolve()
        })
      })
    })
  })
})

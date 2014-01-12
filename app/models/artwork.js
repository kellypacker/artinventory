
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Imager = require('imager');
var env = process.env.NODE_ENV || 'development'
var config = require('../../config/config')[env]
var imagerConfig = require(config.root + '/config/imager.js')
var Schema = mongoose.Schema
var utils = require('../../lib/utils')

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Artwork Schema
 */

var ArtworkSchema = new Schema({
  title: {type : String, default : '', trim : true},
  tags: {type: [], get: getTags, set: setTags},
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

ArtworkSchema.path('title').required(true, 'Artwork title cannot be blank');

/**
 * Pre-remove hook
 */

ArtworkSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err)
  }, 'artwork')

  next()
})

/**
 * Methods
 */

ArtworkSchema.methods = {

  /**
   * Save artwork and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3')
    var self = this

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err)
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files }
      }
      self.save(cb)
    }, 'artwork')
  },
}

/**
 * Statics
 */

ArtworkSchema.statics = {

  /**
   * Find artwork by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  /**
   * List artworks
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('title', 'title')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Artwork', ArtworkSchema)

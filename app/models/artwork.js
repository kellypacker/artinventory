
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Imager = require('imager');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var imagerConfig = require(config.root + '/config/imager.js');
var Schema = mongoose.Schema;
var utils = require('../../lib/utils');

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',');
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
}

/**
 * Artwork Schema
 */

var ArtworkSchema = new Schema({
  title: {type : String, default : '', trim : true},
  longTitle: {type : String, default : '', trim : true},
  tags: {type: [], get: getTags, set: setTags},
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now},
  medium: {type: String},
  height: {type: Number},
  width: {type: Number},
  price: {type: Number},
  availableOnEtsy: {type: Boolean},
  etsyOptions: {type: String},
  year: {type: Number},
  sold: {type: Boolean},
  soldAt: {type : Date, default : Date.now},
  soldTo: {type : String},
  amountSalesTaxPaid: {type : Number},
  salesTaxPaidDate: {type : Date, default : Date.now},
  saleNotes: {type: String},
  notes: {type: String}
});

/**
 * Validations
 */

ArtworkSchema.path('title').required(true, 'Artwork title cannot be blank');

/**
 * Pre-remove hook
 */

ArtworkSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3');
  var files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err);
  }, 'artwork');

  next();
});

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
    if (!images || !images.length) return this.save(cb);
    var imager = new Imager(imagerConfig, 'S3');
    var self = this;
    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err);
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files }
      }
      self.save(cb);
    }, 'artwork');
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
      //.populate('title', 'title')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  getMediums: [
    "oil pastel on paper",
    "oil pastel on matboard/wood panel",
    "acrylic on matboard",
    "acrylic",
    "acrylic on canvas",
    "acrylic on wood panel",
    "acrylic on paper",
    "oil pastel and colored pencil on paper",
    "mixed media on paper",
    "mixed media on matboard",
    "mixed media on wood panel",
    "wood block print",
    "video installation",
    "mural",
    "gauche, oil pastel on paper"
  ],
  getEtsyOptions: ["Giclée prints are available in my Etsy store", "Original artwork available in my Etsy store"],
  soldToOptions: [ "Etsy", "Enso", "Private", "Danforth Gallery", "Basement Gallery" ],
  getYears: function (argument) {
    var years = [];
    var startYear = 2001;
    var currentYear = new Date().getFullYear();
    for (var i = currentYear; i >= startYear; i--) {
      years.push(i);
    };
    return years;
  }

}

mongoose.model('Artwork', ArtworkSchema)

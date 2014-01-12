
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Artwork = mongoose.model('Artwork');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

/**
 * Load
 */

exports.load = function(req, res, next, id){
  // var User = mongoose.model('User')
  console.log("LOAD")
  Artwork.load(id, function (err, article) {
    if (err) return next('err')
    if (!artwork) return next(new Error('not found'))
    req.artwork = artwork
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }
  Artwork.list(options, function(err, artworks) {
    console.log(err)
    if (err) return res.render('505')
    Artwork.count().exec(function (err, count) {
      res.render('artworks/index', {
        title: 'Artwork',
        artworks: artworks,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

/**
 * New artwork
 */

exports.new = function(req, res){
  console.log(new Artwork({}))
  res.render('artworks/new', {
    title: 'New Artwork',
    artwork: new Artwork({})
  })
}

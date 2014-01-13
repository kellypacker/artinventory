
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
  Artwork.load(id, function (err, artwork) {
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
    if (err) return res.render('500')
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
  res.render('artworks/new', {
    title: 'New Artwork',
    artwork: new Artwork({})
  })
}

/**
 * Create an artwork
 */

exports.create = function (req, res) {
  var artwork = new Artwork(req.body)

  artwork.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created artwork!')
      return res.redirect('/artworks/'+artwork._id)
    }

    res.render('artworks/new', {
      title: 'New Artwork',
      artwork: artwork,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an artwork
 */

exports.edit = function (req, res) {
  res.render('artworks/edit', {
    title: 'Edit ' + req.artwork.title,
    artwork: req.artwork
  })
}

/**
 * Update artwork
 */

exports.update = function(req, res){
  var artwork = req.artwork
  artwork = extend(artwork, req.body)

  artwork.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/artworks/')
    }

    res.render('artworks/edit', {
      title: 'Edit Article',
      artwork: artwork,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('artworks/show', {
    title: req.artwork.title,
    artwork: req.artwork
  })
}

/**
 * Delete an artwork
 */

exports.destroy = function(req, res){
  var artwork = req.artwork
  artwork.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/artworks')
  })
}


/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
// var Artwork = mongoose.model('Artwork');
var ArtGroup = mongoose.model('ArtGroup');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

/**
 * Load
 */

exports.load = function(req, res, next, id){
  // var User = mongoose.model('User')
  console.log(id)
  ArtGroup.load(id, function (err, artGroup) {
    if (err) return next('err');
    if (!artGroup) return next(new Error('not found'));
    req.artGroup = artGroup;
    next();
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  }
  ArtGroup.list(options, function(err, artGroups) {
    if (err) return res.render('500');
    ArtGroup.count().exec(function (err, count) {
      res.render('series/index', {
        title: 'ArtGroup',
        artGroups: artGroups,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
}

/**
 * New art group
 */

exports.new = function(req, res){
  var artGroup = new ArtGroup({});
  res.render('series/new', {
    title: 'New Art Group',
    artGroup: artGroup
  });
}

/**
 * Create an ArtGroup
 */

exports.create = function (req, res) {
  var artGroup = new ArtGroup(req.body);

  artGroup.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created art group!');
      return res.redirect('/series/'+artGroup._id);
    }

    res.render('series/new', {
      title: 'New Art Group',
      artGroup: artGroup,
      errors: utils.errors(err.errors || err)
    });
  });
}

/**
 * Edit an art group
 */

exports.edit = function (req, res) {
  res.render('series/edit', {
    title: 'Edit ' + req.artGroup.name,
    artGroup: req.artGroup
  });
}

/**
 * Update art group
 */

exports.update = function(req, res){
  var artGroup = req.artGroup;
  artGroup = extend(artGroup, req.body);
  artGroup.sold = req.body.sold == undefined ? false : true;
  artGroup.availableOnEtsy = req.body.availableOnEtsy == undefined ? false : true;
  artGroup.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/series/');
    }

    res.render('series/edit', {
      title: 'Edit Art Group',
      artGroup: artGroup,
      errors: err.errors
    });
  });
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('series/show', {
    title: req.artGroup.name,
    artGroup: req.artGroup
  })
}

/**
 * Delete an artwork
 */

exports.destroy = function(req, res){
  var artGroup = req.artGroup;
  artGroup.remove(function(err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/series');
  })
}

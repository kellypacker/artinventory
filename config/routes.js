
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var passportOptions = {
  failureFlash: 'Invalid email or password.',
  failureRedirect: '/login'
}

/**
 * Controllers
 */

// var users = require('../app/controllers/users')
var artworks = require('../app/controllers/artworks');
var series = require('../app/controllers/artGroups');
// var auth = require('./middlewares/authorization')

var home = require('home');

/**
 * Expose
 */

module.exports = function (app, passport) {

  // artworks routes
  app.param('artwork_id', artworks.load)
  app.get('/artworks', artworks.index)
  app.get('/artworks/new', artworks.new)
  app.post('/artworks', artworks.create)
  app.get('/artworks/:artwork_id', artworks.show)
  app.get('/artworks/:artwork_id/edit', artworks.edit)
  app.put('/artworks/:artwork_id', artworks.update)
  app.del('/artworks/:artwork_id', artworks.destroy)

  app.param('series_id', series.load)
  app.get('/series', series.index)
  app.get('/series/new', series.new)
  app.post('/series', series.create)
  app.get('/series/:series_id/edit', series.edit)
  app.put('/series/:series_id', series.update)
  app.del('/series/:series_id', series.destroy)

  // home route
  app.get('/', artworks.index)
}

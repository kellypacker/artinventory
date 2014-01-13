
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
var artworks = require('../app/controllers/artworks')
// var auth = require('./middlewares/authorization')

var home = require('home')

/**
 * Expose
 */

module.exports = function (app, passport) {

  // artworks routes
  app.param('id', artworks.load)
  app.get('/artworks', artworks.index)
  app.get('/artworks/new', artworks.new)
  app.post('/artworks', artworks.create)
  app.get('/artworks/:id', artworks.show)
  app.get('/artworks/:id/edit', artworks.edit)
  app.put('/artworks/:id', artworks.update)
  app.del('/artworks/:id', artworks.destroy)

  // home route
  app.get('/', artworks.index)
}

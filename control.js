const flow = require('./controller/flow.js');
const models = require('./app/models');
const express           = require('express');
const passport          = require('passport');
const passportLocal     = require('passport-local').Strategy;
const async             = require('async');
const moment            = require('moment');
const session           = require('express-session');
const Store             = require('express-session').Store;
const BetterMemoryStore = require('session-memory-store')(session);
const app               = express();
//require('./config/passport')(passport, models.user);


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

module.exports = function(app, passport) {
//module.exports = function(req, res, next) {
  app.get('/login', flow.login);
  app.get('/user', flow.user);
  app.post('/login', passport.authenticate('local', {
    sucessRedirect: '/students',
    failureRedirect: '/login'
}));
  app.get('/students', flow.index);
}
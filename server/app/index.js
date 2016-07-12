'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

var User = require('../api/users/user.model');

//var urlencodedParser = bodyParser.urlencoded({extended:false});
//app.use(bodyParser.urlencoded({extended:false}));

app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.use(require('./statics.middleware'));

app.use(session({
  secret: 'tongiscool'
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use('/api', function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.post('/login', function (req, res, next) {
  User.findOne({where: req.body})
  .then(function (user) {
    if (!user) {
      res.status(401).send();
    }
    else {
      req.session.user = user;
      req.session.userId = user.id;
      res.status.send();
    }

  })
  .catch(next);


})

app.use(require('./error.middleware'));

module.exports = app;


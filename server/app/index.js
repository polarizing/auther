'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../api/users/user.model');

// client id
// 161527000350-a2i1bem1urqesin7q9kpvr2h5q66cenj.apps.googleusercontent.com
// client secret
// 2V1EYelrFLcZ1D0GUlJZS9TO

app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.use(session({
  secret: 'tongiscool'
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

// OAUTH 
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy({
    clientID: '161527000350-a2i1bem1urqesin7q9kpvr2h5q66cenj.apps.googleusercontent.com',
    clientSecret: '2V1EYelrFLcZ1D0GUlJZS9TO',
    callbackURL: '/auth/google/callback'
  },
  // Google will send back the token and profile
  function (token, refreshToken, profile, done) {

    var info = {
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos ? profile.photos[0].value : undefined
    };
    User.findOrCreate({where: {googleId: profile.id}, defaults: info})
    .spread(function (user) {
      console.log('should be 1');
      done(null, user);
      console.log('should not be run');
    })
    .catch(done);
    // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
    /*
    --- fill this part in ---
    */
  })
);

passport.serializeUser(function (user, done) {
  console.log('should be 2')
        done(null, user.id);
      });

passport.deserializeUser(function (id, done) {
  console.log('should be 3')
  User.findById(id)
  .then(function (user) {
    done(null, user);
  })
  .catch(function (err) {
    done(err);
  });
});

app.use(require('./statics.middleware'));

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


app.get('/auth/me', function (req, res, next) {
  res.send(req.session.user);
})

// Google authentication and login 
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/stories', // or wherever
    failureRedirect : '/login' // or wherever
  })
);

app.post('/login', function (req, res, next) {
  User.findOne({where: req.body})
  .then(function (user) {
    if (!user) {
      res.sendStatus(401);
    }
    else {
      req.session.user = user;
      res.status(200);
      res.send(user);
    }

  })
  .catch(next);
})

app.get('/logout', function (req, res, next) {
  req.session.user = null;
  res.sendStatus(200);
})

app.use(require('./error.middleware'));

module.exports = app;


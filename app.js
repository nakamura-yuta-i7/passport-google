var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

void function viewEngineSetup() {
	// app.set('views', path.join(__dirname, 'views'));
	// app.set('view engine', 'jade');
	// HTML engine sample :
	
	var cons = require('consolidate');
	app.engine('html', cons.swig);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'html');
}();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
var passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

passport.serializeUser(function(user, done) {
	console.log( "passport.serializeUser  user", user );
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  console.log( "passport.deserializeUser  id", id );
	done(null, {id: id});
});

var GooglePlusStrategy = require('passport-google-plus');

passport.use(new GooglePlusStrategy({
    clientId: '1021662968927-k16a3mjb9f07fhfj45erni75jdfipu9i.apps.googleusercontent.com',
    clientSecret: 'Uute1kaqmaIJP6ANd6KsrRCM'
  },
  function(tokens, profile, done) {
    // Create or update user, call done() when complete...
    done(null, profile, tokens);
  }
));
app.post('/auth/google/callback', passport.authenticate('google'), function(req, res) {
	console.log( "/auth/google/callback  user", req.user );
  // Return user back to client 
  res.send(req.user);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

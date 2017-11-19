var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var index = require('./routes/index');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
const dishRouter = require('./routes/dishRouter');
const Dishes = require('./models/dishes');
var users = require('./routes/users');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url, {
  useMongoClient: true
});

connect.then((db) => {
  console.log("Connected Correctly");

}, (err) => {console.log(err);});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser('123456789'));
app.use(session({
  name: 'session-id',
  secret: '123456789',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {

    var err = new Error('You Are Not Auth');
    err.status = 401;
    return next(err);
  }
  else {
    if (req.session.user === 'authenticated') {
      next();
    } else {
      var err = new Error('You Are Not Auth');
      err.status = 403;
      return next(err);
    }
  }
}

app.use('/', index);
app.use('/users', users);

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

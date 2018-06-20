var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var firebase = require("firebase");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCHfnjNm-3t43KqZukO4UvgnW4Puivi7xo",
  authDomain: "recognizedios.firebaseapp.com",
  databaseURL: "https://recognizedios.firebaseio.com",
  projectId: "recognizedios",
  storageBucket: "recognizedios.appspot.com",
  messagingSenderId: "251451876031"
};
firebase.initializeApp(config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/prueba',function(req,res) {
  res.render('prueba');
});

app.get('/login',function(req,res) {
  res.render('login');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('page-error-404');
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

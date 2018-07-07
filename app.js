var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var firebase = require("firebase");
require('firebase/auth');
require('firebase/database');

var usersRouter = require('./routes/users');
var userAuth = require("./auth.js");
var user = require("./models/user.js");
var curso = require("./models/curso.js");
var emotion = require("./models/emotion.js");

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
userAuth.setModel(firebase);
user.setModel(firebase);
curso.setModel(firebase);
emotion.setModel(firebase);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

// Ruta para la prueba del tema
app.get('/prueba',function(req,res) {
  res.render('prueba');
});

// User authentication
//app.get('/login', userAuth.prueba2);
app.get('/login',function(req,res) {
  res.render('login');
});
app.post('/auth', userAuth.login);
app.get('/salir', userAuth.logout);

//app.get('/', userAuth.prueba2);
app.get('/', emotion.showall)

// Rutas para el manejo de los Usuario
app.get('/profesor_crear',function(req,res) {
  res.render('usuarios/create-user');
});
app.get('/profile', user.show);
app.get('/profesor_lista', user.showall);
app.post('/crear_user', user.create);
app.post('/user_remove', user.delete);

// Rutas para el manejo de los Cursos
app.get('/curso_lista', curso.showall);
app.post('/crear', curso.create);
app.get('/curso_crear',function(req,res) {
  res.render('cursos/crear-curso');
});

// Rutas para el manejo de las emociones
app.get('/ver_emociones', emotion.showallEmotion);

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

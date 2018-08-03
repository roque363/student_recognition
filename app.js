var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var firebase = require("firebase");
require('firebase/auth');
require('firebase/database');

var app = express();

// Agrega las rutas
var usersRouter = require('./routes/users');
var userAuth = require("./auth.js");
var user = require("./models/user.js");
var curso = require("./models/curso.js");
var emotion = require("./models/emotion.js");

// Agrega el SDK
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey/recognizedios-firebase-adminsdk-m8jeg-3e08141bbe.json');

// Inicializa el SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://recognizedios.firebaseio.com"
});
user.setAdmin(admin);

// Inicializa Firebase
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
app.set('view engine', 'pug');

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
app.get('/', emotion.showall);
app.get('/get_emotions', emotion.showEmotion);

// Usuarios
app.get('/profile', user.showCurrentUser);
app.get('/profesor_crear',function(req,res) {
  res.render('usuarios/create-user');
});
app.get('/user_detail', user.showOne);
app.post('/user_edit', user.update);
app.get('/profesor_lista', user.showall);
app.post('/crear_user', user.create);
app.post('/user_remove', user.delete);

// Cursos
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

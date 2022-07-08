var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require("express-session");
const passport = require('./passport').passport
require('dotenv').config()

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var mongoDB = process.env.mongo_db_key;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages')

var app = express();

// view engine setup
app.engine('ejs', require('express-ejs-extend')); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err)
  res.render('error', { title: 'Error' });
});

module.exports = app;

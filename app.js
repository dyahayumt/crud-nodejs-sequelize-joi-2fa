const fs                = require("fs");
const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const index             = require('./routes/index');
const users             = require('./routes/users');
const reset             = require('./routes/reset-pass');
const con               = require('./routes/dbconfig');
const Sequelize         = require('sequelize');
//const config          = require('./db');
const models            = require('./app/models');
const Student           = require('./app/models/student');
var basename            = path.basename(module.filename);
var env                 = process.env.NODE_ENV || 'development';
var config              = require('./config/config')[env];
//const db              = require('./db');
const schema            = require('./valid/student_joi.js');
const alert             = require('alert-node');
const crypto            = require('crypto');
const passport          = require('passport');
const passportLocal     = require('passport-local').Strategy;
const async             = require('async');
const moment            = require('moment');
const session           = require('express-session');
const Store             = require('express-session').Store;
const BetterMemoryStore = require('session-memory-store')(session);
const app               = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.moment       = require('moment');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store:  store,
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });

passport.use('local', new passportLocal ({
  usernameField: 'user_name',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} , function (req, user_name, password, done) {
      if(!user_name || !password ) { 
        return done(null, alert('message','All fields are required.')); 
      }
      con.query("select * from users where user_name = ?", [user_name], function(err, rows){
          console.log(err); 
          console.log(rows);
        if (err) return done;
        if(!rows.length) { 
          return done(null, false, alert('Invalid username or password.')); 
        }
        var encPassword = crypto.createHash('sha1').update(password).digest('hex');
        var dbPassword  = rows[0].password;
        if(!(dbPassword == encPassword)) {
            return done(null, false, alert('Invalid username or password.'));
         }

        return done(null, rows[0]);
      });
    }
));

passport.serializeUser(function(student, done) {
  done(null, student.student_id);
});
passport.deserializeUser(function(student_id, done) {
  con.query("select * from users where student_id = ?", [student_id], function (err, user){
      if (err) return done(err);
      done(null, user);
  });

});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post("/login", passport.authenticate('local', {
  successRedirect: '/students',
  failureRedirect: '/login',
}), function(req, res, info){
  res.render('login');
});

app.get('/students', isAuthenticated, function(req, res) {
  var studentList = [];

  // Do the query to get data.
  con.query('SELECT * FROM student', function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);
    res.render('index.pug', {title: 'Student List', data: rows});
    }
  })
});


// Student.create({
//   student_id: '3.3.3',
//   first_name: 'Coba',
//   last_name: 'coba',
//   middle_name: 'coba',
//   gender: 'M',
//   place_of_birth: 'Wonogiri',
//   date_of_birth: '1995-07-12',
//   phone_number: '081929323929',
//   email_address:'coba@gmail.com',
//   date_time: '2018-01-01 01:01:01:01',
// })
// .then(newStudent => {
// console.log('New user has been created.');
// });

app.use('/', index);
app.use('/', reset);

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
//server.listen(config.server.port);
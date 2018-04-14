const express           = require('express');
const app               = express();
const fs                = require("fs");
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const index             = require('./routes/index');
const users            = require('./routes/users');
const reset             = require('./routes/reset-pass');
//const login             = require('./routes/login');
// const db              = require('./db');
// const config          = require('./db');
const con               = require('./routes/dbconfig');
const Sequelize         = require('sequelize');
const basename          = path.basename(module.filename);
const env               = process.env.NODE_ENV || 'development';
//const env               = require('dotenv').load();
const config            = require('./config/config')[env];
const schema            = require('./valid/student_joi.js');
const schemauser        = require('./valid/user_joi');
const alert             = require('alert-node');
const crypto            = require('crypto');
const passport          = require('passport');
const passportLocal     = require('passport-local').Strategy;
const async             = require('async');
const moment            = require('moment');
app.locals.moment       = require('moment');
const session           = require('express-session');
const BetterMemoryStore = require('session-memory-store')(session);
const Store             = require('express-session').Store;
const store             = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
const models            = require('./app/models');
const user              = models.users1;
//const users1            = require('./app/models/users1');
models.sequelize.sync().then(function() {
 
  console.log('Nice! Database looks fine')
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});
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
//var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
passport.use('local', new passportLocal ({
  usernameField: 'user_name',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} , function (req, user_name, password, done) {
      if(!user_name || !password ) { 
        return done(null, alert('message','All fields are required.')); 
      }
      user.findAll({
        where: {
          user_name: user_name,
          password : password
        }
      }).then(function(user) {
        if(!user) {
          alert('Invalid user or password');
        } 
        var password = ''+password;
        var encPassword = crypto.createHash('SHA1').update(password).digest('hex');
        var dbPassword  = user.password;
        if(!dbPassword == !encPassword) {
          return done(null, false, alert('Invalid username or password.'));
           } else {
            return done(null, user);
           } 
        });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/students',
  failureRedirect: '/login',
}), function(req, res, info){
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  //var user = User;
  var password = req.body.password;
  var paswd = req.body.password;
  var student_id = req.body.student_id;
  var user_name = req.body.user_name;
  var email_address= req.body.email_address;
  var createRegistration = {
    student_id: req.body.student_id,
    user_name: req.body.user_name,
    password: crypto.createHash('sha1').update(paswd).digest('hex'),
    email_address: req.body.email_address
  };
  models.users1.findOne({
          where: {
            student_id: student_id,
            user_name: user_name,
            email_address: email_address
          }
        }).then(function(user) {
          if(user) {
            alert('Your email address or user name already registred');
          } else {
            models.users1.create(createRegistration)
            .then(newUser => {
              res.redirect('/students');
            })
          }
        })
      });
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

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
const result = schema.validate({ 
  student_id: '1.1.1', 
  first_name: 'Dyah', 
  last_name:'Mustika', 
  middle_name: 'Ning',
  gender: 'F',
  place_of_birth: 'Wonogiri',
  date_of_birth: '01-01-1995',
  phone_number: '091901290921',
  email_address: 'dyahayu@gmail.com',
  date_time: '2018-01-01' },
  function(err, value){
    if (err) {
      console.log(err.message)
    } else{
      console.log('Value have been validate by Joi');
    };
  });
app.use('/', index);
app.use('/', reset);
//app.use('/', login);
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
const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const index             = require('./routes/index');
const users             = require('./routes/users');
const con               = require('./routes/dbconfig');
const flash             = require('connect-flash');
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
app.use(flash());

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
        return done(null, false, req.flash('message','All fields are required.')); 
      }
      con.query("select * from users where user_name = ?", [user_name], function(err, rows){
          console.log(err); 
          console.log(rows);
        if (err) return done(req.flash('message',err));
        if(!rows.length) { 
          return done(null, false, req.flash('message','Invalid username or password.')); 
        }
        var encPassword = crypto.createHash('sha1').update(password).digest('hex');
        var dbPassword  = rows[0].password;
        if(!(dbPassword == encPassword)) {
            return done(null, false, req.flash('message','Invalid username or password.'));
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
  res.render('login',{'message' :req.flash('message')
  });
});

app.get('/forgot_password', function(req, res) {
  res.render('forgot-pass');
});

app.post('/forgot_password', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        console.log(token);
        done(err, token);
      });
    },
    function(token, done) {
      var email_address = req.body.email_address;
      con.query('select * from users where email_address = ?', [email_address], function(err, rows) {
        console.log(err);
        if (!rows.length) {
          req.flash ('error', 'No account with that email address');
          return res.redirect('/forgot_password');
        } else {
          email_address = rows[0].email_address;
          console.log(email_address);
          pwdToken = rows[0].token_pass;
          pwdToken = token;
          console.log(pwdToken);
          pwdExp = rows[0].token_exp;
          pwdExp = new moment().add(10, 'm').toDate();
          console.log(pwdExp);

          con.query('update users set token_pass = ?, token_exp = ? where email_address = ?', [pwdToken, pwdExp, email_address], function(err, rows) {
            done(err, token, rows);
            console.log(rows);
          });
        }
      });
    },
    function(token, rows, done) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: [req.body.email_address],
        from: 'reset-pass@example.org',
        subject: 'Password help has arrived!',
        text: 'Your are receiving this bacause, your request to reset password has been processed. Click the url to reset your password.\n\n' +
        'http://' + req.headers.host + '/reset-password/'+ token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      sgMail.send(msg, function(err) {
        req.flash('info', 'An email has been sent to your email address' + req.body.email_address+ 'with instructions.');
        done(err, 'done')
      });
  }], 
    function(err) {
    if(err) return next(err);
    res.redirect('/');
  });
});  

app.get('/reset-password/:token', function(req, res) {
  con.query('select * from users where token_pass = ?',[req.params.token], function (err, user_name) {
    if (!user_name) {
      req.flash('error', 'Invalid token')
      return res.redirect('reset');
    }
  res.render('request');
});
});

app.post('/reset-password/:token', function(req, res) {
  async.waterfall([
    function(done) {
      con.query('select * from users where token_pass = ?', [req.params.token], function (err, rows) {
        console.log(rows)
        if (!rows.length > 0 ) {
          req.flash('error', 'Invalid Token.');
          return res.redirect('/forgot-password');
        }
        var password = req.body.password;
        console.log(password);
        var token_pass = undefined;
        var token_exp = undefined;
        var pwd = crypto.createHash('sha1').update(password).digest('hex');
        con.query('update users set password = ?, token_pass = ?, token_exp = ? where token_pass = ?', [pwd, token_pass, token_exp, req.params.token], function(err, rows) {
          done(err, rows);
          console.log(rows);
        });
      });
    },
], 
    function (err) {
    res.redirect('/');
  });
}); 

app.get('/user', function(req, res) {
  res.render('user', {'message' :req.flash('message')});
});

app.post('/user', function (req, res) {
  var paswd = req.body.password;
  var createUser = {
    student_id: req.body.student_id,
    email_address: req.body.email_address,
    user_name: req.body.user_name,
    password: crypto.createHash('sha1').update(paswd).digest('hex')
  };
  con.query('INSERT INTO users SET ? ', createUser, function(err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log(rows);
        }
        res.redirect('/');
      });
  });

app.get('/', function(req, res) {
  res.render('home');
});

app.post("/login", passport.authenticate('local', {
  successRedirect: '/students',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res, info){
  res.render('login',{'message' :req.flash('message')});
});
  
function getStudentGender(rows, studentGender){
  if(studentGender === 'M'){
    gender = 'M';
  } else {
    gender = 'F';
  }
  return gender;
}

///
/// HTTP Method	: GET
/// Endpoint 	: /person
/// 
/// To get collection of person saved in MySQL database.
///

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

app.get('/search', function(req, res) {
  var keyword = req.query.keyword;
  var opt= req.query.opt;
  var sortBy= req.query.sortBy;
  var select_student = "SELECT * FROM student where ?? like concat('%', ? ,'%') order by ??";
  con.query(select_student+sortBy, [opt, keyword, opt],function(err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
      console.log(rows);
      res.render('index', {title: 'Student List', data: rows});
      }
    });
  });

app.use('/', isAuthenticated, index);
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
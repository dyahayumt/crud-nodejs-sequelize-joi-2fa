const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const index             = require('../routes/index');
const users             = require('../routes/users');
const con               = require('../routes/dbconfig');
const sgMail            = require('@sendgrid/mail');
const alert             = require('alert-node');
const crypto            = require('crypto');
const passport          = require('passport');
const passportLocal     = require('passport-local').Strategy;
const async             = require('async');
const moment            = require('moment');
const session           = require('express-session');
const Store             = require('express-session').Store;
const BetterMemoryStore = require('session-memory-store')(session);
const router            = express.Router();


router.get('/', function(req, res) {
  res.render('home');
});

router.get('/forgot_password', function(req, res) {
  res.render('forgot-pass');
});

router.post('/forgot_password', function(req, res, next) {
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
          alert ('No account with that email address');
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
        alert('An email has been sent to your email address:\n' + req.body.email_address);
        done(err, 'done')
      });
  }], 
    function(err) {
    if(err) return next(err);
    res.redirect('/');
  });
});  

router.get('/reset-password/:token', function(req, res) {
  con.query('select * from users where token_pass = ?',[req.params.token], function (err, user_name) {
    if (!user_name) {
      alert('Invalid token')
      return res.redirect('reset');
    }
  res.render('request');
});
});

router.post('/reset-password/:token', function(req, res) {
  async.waterfall([
    function(done) {
      con.query('select * from users where token_pass = ?', [req.params.token], function (err, rows) {
        console.log(rows)
        if (!rows.length > 0 ) {
          alert('Invalid Token.');
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

module.exports = router;

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
const models            = require('../app/models');
const user              = models.user;

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
      //con.query('select * from users1s where email_address = ?', [email_address], function(err, rows) {
        user.findAll({
          where : {
            email_address: email_address
          }
        }).then(function(rows, err) {
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
            user.update({
              token_pass: pwdToken,
              token_exp: pwdExp
            }, {
              where: {
                email_address: email_address
              }
            }).then(function(user, err) {
              done(err, token, user);
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


router.get('/reset-password/:token', function(req, res, next) {
  //con.query('select * from user where token_pass = ?',[req.params.token], function (err, user_name) {
  var token_pass = req.body.token_pass;
    user.findAll({
      where: {
        token_pass: [req.params.token]
      }
    }).then(function(token_pass) {
      if (!token_pass) {
        alert('Invalid token?')
        return res.redirect('/');
    }
    res.render('request');
});
});

router.post('/reset-password/:token', function(req, res, next) {
  var token_pass = req.body.token_pass;
  var email_address = req.body.email_address;
  async.waterfall([
    function(done) {
      //con.query('select * from users1s where token_pass = ?', [req.params.token], function (err, rows) {
      user.findAll({
        where: {
          token_pass: [req.params.token]
        }
      }).then(function(rows, err) {
        if (!rows.length) {
          alert('Invalid Token.');
          return res.redirect('/reset-password/:token');
          console.log(rows)
        } 
          //var password = req.body.password;
          var email_address= req.body.email_address;
          //var pwdToken= req.body.token_pass;
          //var pwdExp= req.body.token_exp;
          var password = req.body.password;
          console.log(password);
          var token_pass = null;
          var token_exp = null;
          var pwd = crypto.createHash('sha1').update(password).digest('hex');
          var resetToken = {token_pass: token_pass, token_exp: token_exp, password:pwd }
          user.update(
            resetToken, {
            where: {
              token_pass : req.params.token
            }  
            }).then(function(user, err) {
              done(err, user);
            });
          });
          }], function(err) {
                if (err) console.log(err);
                res.redirect('/');
          });
        })

module.exports = router;

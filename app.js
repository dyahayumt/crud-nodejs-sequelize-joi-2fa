const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
 
const index                 = require('./routes/index');
const users                 = require('./routes/users');
const reset                 = require('./routes/reset-pass');

const mysql = require('mysql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sess = require('express-session');
const Store = require('express-session').Store;
const BetterMemoryStore = require('session-memory-store')(sess);

const con                   = require('./routes/dbconfig');
const env                   = process.env.NODE_ENV || 'development';
const config                = require('./config/config')[env];


const schema                = require('./valid/student_joi.js');
const schemauser            = require('./valid/user_joi');

//const login               = require('./routes/login');
// const db                 = require('./db');
// const config             = require('./db');

const crypto                = require('crypto');
const flash             = require('express-flash');


const Sequelize             = require('sequelize');
const basename              = path.basename(module.filename);

//const env                 = require('dotenv').load();

const alert                 = require('alert-node');
//const passport              = require('passport');
const passportLocal         = require('passport-local').Strategy;
const async                 = require('async');
const moment                = require('moment');
const app = express();
app.locals.moment           = require('moment');
const session               = require('express-session');
//const BetterMemoryStore     = require('session-memory-store')(session);
//const Store                 = require('express-session').Store;
// const store                 = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
const models                = require('./app/models');
const user                  = models.user;
const twoFactor             = require('node-2fa');
const speakeasy             = require('speakeasy');
const secret                = speakeasy.generateSecret();
user.two_factor_temp_secret = secret.base32;
const QRCode                = require('qrcode');
// Returns an object with secret.ascii, secret.hex, and secret.base32.
// Also returns secret.otpauth_url, which we'll use later.

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
var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
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
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} , function (req, username, password, done) {
      if(!username || !password ) { 
        return done(null, alert('message','All fields are required.')); 
      }
      user.findOne({
        where: {
          username: username
        }
      }).then(function(user) {
        if(!user) {
          alert('Invalid username or password');
        } 
        var encPassword = crypto.createHash('sha1').update(password).digest('hex');
        var dbPassword  = user.password;
        if(!(dbPassword == encPassword)) {
            return done(null, false, alert('Invalid username or password.'));
         }

        return done(null, user);
      });
    }
));

passport.serializeUser(function(users, done){
  done(null, users.id);
});

passport.deserializeUser(function(id, done){
  user.findAll({
    where: {
      id: [id]
    }
  }).then(function(rows, err) {   
    done(err, rows[0]);
  })
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

app.get('/signin', function(req, res, next) {
  var username = req.body.username;
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    models.user.findAll({
      where: {
        username: req.query.username
      }
    }).then(function(rows) {
      if (rows[0].status == 'Disable') {
        console.log(rows[0].status);
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          alert('Hi'+ req.user.username +'You successfully logged in')  
          return res.redirect('/students' );
        });
      } else {
        req.flash('username',req.query.username)
        res.redirect('/twofa')
      }
    })
  })(req, res, next);
});

app.get('/twofa', function(req, res) {
   //console.log('username ',req.params.username )
   var user = req.flash('username');
   console.log(user.toString())
   res.render('twofa', {username: user.toString()})
 })
 
app.post('/twofa', function(req, res) {
  //console.log(req.body.username)
  user.findAll({
    where: {
      username: [req.body.username]
    }
  }).then(function(rows) {
    var verifytoken = twoFactor.verifyToken(rows[0].secret_key, req.body.token);
    console.log(req.body.token)
    console.log(verifytoken);
    var newToken = twoFactor.generateToken(rows[0].secret_key)
    console.log(newToken)
    if (verifytoken !== null) {
      user.findOne({
        where: {
          username: [req.body.username]
        },
        attributes: ['id', 'username', 'password']
      }).then(user => 
        req.login(user, function (err) {
          if (err) {
            alert('error', err.message);
            console.log('user',user)
            return res.redirect('back');
          }
          console.log('Logged user in using Passport req.login()');
          console.log('username',req.user.username);
          alert('Hi '+req.user.username+', you successfully logged in')
          res.redirect('/students')
        })
      ) 
    } else {
      req.flash('failed','wrong token, try again !')
      res.render('twofa',{'error': req.flash('failed'),stoken: req.body.token, susername: req.body.username})
    }
  }).catch(error => {
    req.flash('failed','wrong token, try again !')
    res.render('twofa',{'error': alert('failed'),stoken: req.body.token, susername: req.body.username})
  })
})

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
});
 
//var newSecret = twoFactor.generateSecret({name: 'My Awesome App', account: 'username'});
/*
{ secret: 'XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W',
  uri: 'otpauth://totp/My Awesome App:johndoe%3Fsecret=XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W',
  qr: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/My Awesome App:johndoe%3Fsecret=XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W' 
}
*/
//  console.log(newSecret);
//  var newToken = twoFactor.generateToken('XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W');
//  // { token: '630618' } 
//  console.log(newToken);
//  twoFactor.verifyToken('XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W', '765075');
// // // { delta: 0 } 
 
//  twoFactor.verifyToken('XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W', '00');


// app.get('/setting', function(req, res) {
//   user.findAll({
//     where: {
//       username: [req.user.username]
//     }
//   }).then(function(rows) {
//     res.render('setting', {stwo_fa: rows[0].status})
//   })
// })


// app.post('/setting', function(req, res) {
//   console.log(req.body.status)
//   if (req.body.status == 'disable') {
//     user.update({
//       status: 'disable'
//     }, {where: {
//       username: [req.user.username]
//     }}).then(function(rows) {
//       alert('Two-factor authenticated is disabled')
//       res.render('setting', {stwo_fa: req.body.status, 'valid': alert('success')})
//     })
//   } else if (req.body.status == 'enable') {
//     user.findAll({
//       where: {
//         username: [req.user.username]
//       }
//     }).then(function(rows) {
//       if (rows[0].status == 'enable') {
//         var newToken = twoFactor.generateToken(rows[0].secret_key)
//         console.log(newToken)
//         var newSecret = rows[0].secret_key
//         res.render('setting', {'enable' : alert('enabled'),ssrc: rows[0].url_qr, stwo_fa: req.body.status})
//       } else {
//         var nsecret = twoFactor.generateSecret({name: 'Student system', account: req.user.username});
//         var newToken = twoFactor.generateToken(nsecret.secret)
//         console.log(newToken)
//         users.update({
//           secretkey: nsecret.secret,
//           url_qr: nsecret.qr
//         }, {where: {
//           username: [req.user.username]
//         }}).then(function(rows) {
//           users.findAll({
//             where: {
//               username: [req.user.username],
//             }
//           }).then(function(rows) {
//             var newSecret = rows[0].secret_key
//             alert('Success')
//             res.render('setting', {'enable' : alert('Enbled'),ssrc: nsecret.qr, stwo_fa: req.body.two_fa})
//           })
//         })
       
//       }
//     })     
//   }
// })

// app.get('/setting', function(req, res) {
//   var id          = req.body.id;
//   var username    = req.body.username;
//   var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username });
//   console.log(req.user.username);
//   res.render('setting', { qr : newSecret.qr},{stwo_fa: req.body.two_fa} );
// // });
// app.get('/status-enable', function(req, res, next) {
//   var id = req.body.id;
//   var secret_key= req.body.secret_key;
// user.findAll({
//   where:{
//     id: req.body.id
//   }
// }).then(function(req) {
//   //console.log(req.body.secret_key);
//   if(req.body.status === 'Disable') {
//     var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username });
//     var userStatus = {
//       secret_key: newSecret.secret,
//       qrcode_uri: newSecret.qr
//     }
//     user.update(
//       userStatus,
//       {
//         where: {
//           user: req.user.username
//         }
//       }).then(update => {
//         alert('Enable', newSecret);
//         res.render('setting', {title: 'Security', nameTag: req.user.username, qr: newSecret.qr, secret_key: newSecret.secret, 'Enable': alert('Enable')});
//       })
//     } else {
//       console.log(rows);
//       alert('Enable', newSecret);
//       res.render('setting', {title: 'Security', nameTag: req.user.username, qr: newSecret.qr, secret_key: newSecret.secret, 'Enable': alert('Enable')});
//     }
//   })
// });

// app.get('/status-disable', function(req, res, next) {
//   users.findOne({
//     where: {
//       user: req.user.username
//     }
//   })
//   .then(function (req) {
//     console.log(req.user.secret_key);
//     // if (rows.dataValues.status_two_fa === 'enable') {
//       var atrUsers = {
//         secret_code: req.user.secret_code,
//         qrcode_uri: req.user.qrcode_uri,
//         status: 'Disable'
//       }
//       user.update(
//         atrUsers,
//         {
//         where: {
//           user: req.user.username
//         }
//       })
//       .then(update => {
//         res.render('setting', {title: 'Security', nameTag: req.user.username});
//       })
//     // } else {




//     // }
//   })
// });

// app.get('/setting', function(req,res){
//   var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username });
//   res.render('setting', { qr : newSecret.qr}), {stwo_fa: req.user.status};
//   console.log(req.user.status);
// });

app.post('/twofaauth', function(req, res) {
  var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username});
  console.log(req.user.username);
  var twofa       = newSecret.token;
  var tokenauth   = twoFactor.generateToken(twofa);
  var auth        = req.user.auth;
  var qrUrl       = newSecret.qr;
  var secret      = newSecret.secret;
  //var authactive  = "1";
  user.findAll({
    where: {
      id : req.user.id
    }
  }).then(function(twofa) {
    if (!twofa) {
      alert('Invalid Token')
      return res.render('/setting-enable');
    } else {
      user.update({
        secret_key : secret,
        qrcode_uri : qrUrl
        
      }, {
        where : {
          username: req.user.username
        }
      })
    }
  })
  res.render('setting-enable', { qr : newSecret.qr});
});

// app.get('/setting', function(req, res) {
//   res.render('setting-disable');
// });
   
app.get('/setting', function(req, res) {
  res.render('setting');
});

app.get('/disable2fa', function(req, res) {
  var username = req.body.username;
  var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username});
  user.findAll({
    where: {
      username: [req.user.username]
    }
  }).then(function(rows) {
    user.update({
      status: 'Disable'
    }, {
      where: {
        username: rows[0].username
      }
    }).then(function(rows) {
      alert('Two-factor authenticated is disabled')
      res.render('setting-disable', {stwofa: rows[0].status,  qr : newSecret.qr, 'valid': alert('success')})
          })
        })
      });


app.get('/enable2fa', function(req, res) {
var username = req.body.username;
var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username});
user.findAll({
  where: {
    username: [req.user.username]
  }
}).then(function(rows) {
  user.update({
    status: 'Enable'
  }, {
    where: {
      username: rows[0].username
    }
  }).then(function(rows) {
    alert('Two-factor authenticated is Enabled')
    res.render('setting-enable', {stwofa: rows[0].status,  qr : newSecret.qr, 'valid': alert('success')})
        })
      })
    });      
 



// app.get('/setting-post', function(req,res){
//   var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username });
//   res.render('setting', { qr : newSecret.qr}), {stwofa: req.body.status};
//   console.log(req.body.status);
// });

// app.post('/setting-post', function(req, res) {
//   console.log(req.body.status)
//   if (req.body.status == 'Disable') {
//     user.update({
//       status: 'Disable'
//     }, {where: {
//       username: [req.user.username]
//     }}).then(function(rows) {
//       alert('Two-factor authenticated is disabled')
//       res.render('setting', {stwofa: req.body.status, 'valid': alert('success')})
//     })
//   } else if (req.body.status == 'Enable') {
//     user.findAll({
//       where: {
//         username: [req.user.username]
//       }
//     }).then(function(rows) {
//       if (rows[0].status == 'Enable') {
//         var newToken = twoFactor.generateToken(rows[0].secret_key)
//         //console.log(newToken)
//         var Secret = rows[0].secret_key;
//         res.render('setting', {qr: rows[0].qrcode_uri, stwofa: req.body.status})
//       } else {
//         // var nSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username});        
//         // var nToken = twoFactor.generateToken(nSecret.secret)
//         var newSecret   = twoFactor.generateSecret({ name: 'My Awesome App', account: req.user.username});
//         console.log(req.user.username);
//         var twofa       = newSecret.token;
//         var tokenauth   = twoFactor.generateToken(twofa);
//         var auth        = req.user.auth;
//         var qrUrl       = newSecret.qr;
//         var secret      = newSecret.secret;
//         console.log(nToken)
//         user.findAll({
//               where: {
//                 id : req.user.id
//               }
//             }).then(function(twofa) {
//               if (!twofa) {
//                 alert('Invalid Token')
//                 return res.render('/setting');
//               } else {
//                 user.update({
//                   secret_key : secret,
//                   qrcode_uri : qrUrl
                  
//                 }, {
//                   where : {
//                     username: req.user.username
//                   }
//                 })
//               }
//             })
//             res.render('setting', {qr: newSecret.qr, stwofa: req.body.status})
//           }
//         },
//       )}
//     });
//         })
//       }
//     })     
//   }
// })

// app.get('/qrgenerator/',function(req, res) {
//   user.findAll({
//     where: {
//       username: req.user.username
//     }
//   }).then(function(rows) {
//     var verifytoken = twoFactor.verifyToken(rows[0].secret_key, req.query.token);
//     console.log(req.query.token)
//     if (verifytoken !== null) {
//         alert('Token Valid')
//         alert(rows[0].secret_key)
//         res.render('setting',{'valid': alert('valid'), stwofa: 'Enable', 'Enable': alert('Enabled'),qr: rows[0].qrcode_uri, stoken: req.query.token})
//       // })
//     } else {
//       alert('Wrong token, try again !')
//       alert(rows[0].secret_key)
//       res.render('setting',{'failed': alert('failed'), stwofa: 'Disable', 'Enable': alert(''),ssrc: rows[0].qrcode_uri, stoken: req.query.token})
//     }
//     console.log(twoFactor.verifyToken(rows[0].secret_key, req.query.token));
//   })
// })

// app.post('/settingcon', function(req,res) {
//   user.update({
//     status: 'Enable'
//   }, { where: {
//     username: req.user.username
//   }}).then(function(rows) {
//     req.flash('success', 'Two-factor authentication is enabled')
//     res.render('setting',{'valid': req.flash('success'), stwofa: 'Enable'})
//   })
// })

// router.get('/btn-enable', function(req, res, next) {
//   users.findOne({
//     attributes: ['user', 'secret_code', 'url_qr', 'status_two_fa'],
//     where: {
//       user: req.user.user
//     }
//   })
//   .then(function (rows) {
//     console.log(rows.dataValues.secret_code);
//     if (rows.dataValues.status_two_fa === 'disable') {
//       var newSecret = twoFactor.generateSecret({name: 'Student Database', account: req.user.user});
//       var atrUsers = {
//         secret_code: newSecret.secret,
//         url_qr: newSecret.qr
//       }
//       users.update(
//         atrUsers,
//         {
//         where: {
//           user: req.user.user
//         }
//       })
//       .then(update => {
//         req.flash('enable', newSecret);
//         res.render('two-factor-auth', {title: 'Security', nameTag: rows.dataValues.user, uri_barcode: newSecret.qr, secret_code: rows.dataValues.secret_code, 'enable': req.flash('enable'), id:"#active"});
//       })
//     } else {
//       console.log(rows);
//       req.flash('enable', newSecret);
//       res.render('two-factor-auth', {title: 'Security', nameTag: rows.dataValues.user, uri_barcode: rows.dataValues.url_qr, secret_code: rows.dataValues.secret_code, 'enable': req.flash('enable')});
//     }
//   })
// });

// app.get('/setting', function(req, res) {
//   user.findAll({
//     where: {
//       username: [req.user.username]
//     }
//   }).then(function(rows) {
//     res.render('setting', {stwo_fa: rows[0].status})
//   })
// })

// app.post('/setting', function(req, res) {
//   console.log(req.body.two_fa)
//   if (req.body.two_fa == 'Disable') {
//     user.update({
//       status: 'Disable'
//     }, {where: {
//       username: [req.user.username]
//     }}).then(function(rows) {
//       alert('Two-factor authenticated is disabled')
//       res.render('setting', {stwofa: req.body.status}, alert('Success'))
//     })
//   } else if (req.body.status == 'Enable') {
//     user.findAll({
//       where: {
//         username: [req.user.username]
//       }
//     }).then(function(rows) {
//       if (rows[0].two_fa == 'Enable') {
//         var newToken = twoFactor.generateToken(rows[0].secret_key)
//         console.log(newToken)
//         var newSecret = rows[0].secret_key
//         req.flash('code',newSecret)
//         res.render('setting', {'enable' : alert('code'),ssrc: rows[0].qrcode_uri, stwofa: req.body.status})
//       } else {
//         var nsecret = twoFactor.generateSecret({name: 'Student system', account: req.user.username});
//         var newToken = twoFactor.generateToken(nsecret.secret)
//         console.log(newToken)
//         user.update({
//           secret_key: nsecret.secret,
//           qrcode_uri: nsecret.qr
//         }, {where: {
//           username: [req.user.username]
//         }}).then(function(rows) {
//           user.findAll({
//             where: {
//               username: [req.user.username],
//             }
//           }).then(function(rows) {
//             var newSecret = rows[0].secretkey
//             alert('code',newSecret)
//             res.render('setting', {'enable' : alert('code'),qr: nsecret.qr, stwofa: req.body.status})
//           })
//         })
//       }
//     })     
//   }
// })

app.get('/qrgenerate',function(req, res) {
  users.findAll({
    where: {
      username: req.user.username
    }
  }).then(function(rows) {
    var verifytoken = twoFactor.verifyToken(rows[0].secretkey, req.query.token);
    console.log(req.query.token)
    if (verifytoken !== null) {
        req.flash('valid','valid token')
        req.flash('code',rows[0].secretkey)
        res.render('setting',{'valid': req.flash('valid'), stwo_fa: 'enable', 'enable': req.flash('code'),ssrc: rows[0].url_qr, stoken: req.query.token})
    } else {
      req.flash('failed','wrong token, try again !')
      req.flash('code',rows[0].secretkey)
      res.render('setting',{'failed': req.flash('failed'), stwo_fa: 'disable', 'enable': req.flash('code'),ssrc: rows[0].url_qr, stoken: req.query.token})
    }
    console.log(twoFactor.verifyToken(rows[0].secretkey, req.query.token));
  })
})


app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  //var user = User;
  var password           = req.body.password;
  var paswd              = req.body.password;
  var id                 = req.body.id;
  var username           = req.body.username;
  var email_address      = req.body.email_address;
  var createRegistration = {
    id: req.body.id,
    username: req.body.username,
    password: crypto.createHash('sha1').update(paswd).digest('hex'),
    email_address: req.body.email_address
  };
  models.user.findAll({
          where: {
            id: id,
            username: username,
            email_address: email_address
          }
        }).then(function(user) {
          if(user) {
            alert('Your email address or user name already registred');
          }else {
            models.user.create(createRegistration)
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

app.get('/students', isAuthenticated, function(req, res, user) {
  var studentList = [];
  // Do the query to get data.
  con.query('SELECT * FROM student', function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);
      console.log(req.user)
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
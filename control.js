const flow = require('./controller/flow.js');
module.exports = function(app, passport) {
  app.get('/login', flow.login);
  app.get('/user', flow.user);
  app.post('/user', passport.authenticate('user',{
    sucessRedirect: '/',
    failureRedirect: '/user'
}));
app.get('/students', flow.index);
}
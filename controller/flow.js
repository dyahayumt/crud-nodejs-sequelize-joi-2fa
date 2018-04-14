var exports = module.exports = {}
exports.login = function(req, res) {
  res.render('login');
}

exports.user = function(req, res) {
  res.render('user');
}

exports.index = function(req,res) {
  res.render('index');
}
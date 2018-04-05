"use strict";

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(path.join(__dirname, '..', '..', 'config', 'config.js'))[env];
//var sequelize = new Sequelize(config.database.host, config.database.user, config.database.password, config.database.db, config.database);
var db        = {};

// var models = require("../models");
 
// //Sync Database
// models.sequelize.sync().then(function() {
 
//     console.log('Nice! Database looks fine')
 
// }).catch(function(err) {
 
//     console.log(err, "Something went wrong with the Database Update!")
 
// });


if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(process.env.MYSQL_DATABASE , process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST || 'localhost',
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file  !== "index.js");
  })
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === 'index.js');
    })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db
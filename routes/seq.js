const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.database.db, 
  config.database.username, 
  config.database.password, {
  host: config.database.host,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
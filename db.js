const Sequelize = require('sequelize');
const sequelize = new Sequelize('student_info', 'root', 'wonderlabs', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3000',

    pool: {
        max: 5,
        min: 0,
        idle: 20000,
        acquire: 20000
    },
    logging: false,
    define: {
      underscored: false,
      freezeTableName: false,
      syncOnAssociation: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      classMethods: {method1: function() {}},
      instanceMethods: {method2: function() {}},
      timestamps: true,
      schema: "prefix"
    }
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
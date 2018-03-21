const env = process.env.NODE_ENV || 'development';
const mysql         = require('mysql');
//const myConnection  = require('express-myconnection');
const config        = require('../config/config')[env];
const con           = mysql.createConnection ({
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port, 
    database: config.database.db
});

module.exports = con;
const db = require('../../db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

var models = require("../models");
 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});
module.exports = function(sequelize, Sequelize) {

    var Student = sequelize.define('student', {

        student_id: {
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        first_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        last_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        middle_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        gender: {
        type: Sequelize.ENUM('M', 'F'),
        defaultValue: 'M'
        },
        place_of_birth: {
            type: Sequelize.TEXT
        },

        date_of_birth: {
            type: Sequelize.DATE
        },

        phone_number: {
            type: Sequelize.TEXT,
            validate: {
                isEmail: true
            }
        },

        email_address: {
            type: Sequelize.TEXT,
            allowNull: false
        },

        date_time: {
            type: Sequelize.DATE
        },
        
            table_name:'student',
            freezeTableName: true,
            timestamps: true
        });

    return User;
    };

        


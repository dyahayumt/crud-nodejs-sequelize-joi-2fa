const data = require('../db'),
    sequelize = data.sequelize,
    Sequelize = data.Sequelize;

//Sync Database
sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});
 
const Student = sequelize.define('student', {

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
        notEmpty:true
    },

    gender: {
        type: Sequelize.ENUM('M', 'F'),
        notEmpty:true
    },

    place_of_birth: {
    type: Sequelize.STRING,
    notEmpty:true
    },

    date_of_birth: {
    type: Sequelize.DATE,
    notEmpty:true
    },

    phone_number: {
    type: Sequelize.STRING,
    notEmpty:true
    },

    email_address: {
        type: Sequelize.STRING,
        allowNull: false
    },

    date_time: {
        type: Sequelize.DATE
    }
    },

    {
        table_name:'student',
        freezeTableName: true,
        timestamps: false
    });
module.exports = Student;

const db = require('../db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

const Users = sequelize.define('users', {
    student_id: {
        type: Sequelize.INTEGER
    },
    email_address: {
        type: Sequelize.STRING
    },
    user_name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    token_pass: {
        type: Sequelize.STRING
    },
    token_exp: {
        type: Sequelize.DATE
    }
});
 
// Users.sync({force: true}).then(() => {
//     //Table created
//     return Users.created({
//         student_id: '3.3.3',
//         email_address: 'coba@gmail.com',
//         user_name: 'coba',
//         password: 'login',
//         token_pass: ' 6228fcd5b58de800fd5798dd4cc5b6ccb233220b',
//         token_exp: '',
//     })
// })
module.exports = Users;
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
 
module.exports = Joi.object().keys({
  student_id: Joi.string() .error(new Error('Student ID is missing')),
  email_address: Joi.string().email() .error(new Error('Email is missing')).required(),
  user_name: Joi.string().min(1).max(50) .error(new Error('User name is missing')).required(),
  password: Joi.string().min(1).max(50) .error(new Error('Password is missing')).required(),
})

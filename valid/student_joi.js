const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
 
module.exports = Joi.object().keys({
  student_id: Joi.string() .error(new Error('Student ID is missing')),
  first_name: Joi.string().min(1).max(50).error(new Error('First Name is missing')).required(),
  last_name: Joi.string().min(1).max(50) .error(new Error('Last name is missing')).required(),
  middle_name: Joi.string().min(1).max(50) .error(new Error('Midle name is missing')).required(),
  gender: Joi.string().valid('M', 'F').min(1).max(1) .error(new Error('Gender is missing')).required(),
  place_of_birth: Joi.string().min(1).max(50) .error(new Error('Place of Birth is missing')).required(),
  date_of_birth: Joi.date().format('DD-MM-YYYY').error(new Error('Date of Birth is missing')).required(),
  phone_number: Joi.string().min(10).max(14) .error(new Error('Phone Number is missing')).required(),
  email_address: Joi.string().email() .error(new Error('Email is missing')).required(),
  date_time: Joi.date() .error(new Error('Admission Date is missing')).required()
})

const Joi = require('joi');

const registrationSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).required(),
  idNumber: Joi.string().length(9).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  idPhoto: Joi.string().allow(null),
});

module.exports = { registrationSchema };

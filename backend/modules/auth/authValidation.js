const Joi = require('joi');

const registrationSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).required(),
  password: Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=\\-[\\]{}|:;"\'<>,.?/]).+$'))
  .required(),
  idNumber: Joi.string().length(9).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  multiRole: Joi.array().items(Joi.string()).required(),
  idPhoto: Joi.string().allow(null),
  securityCertificatePhoto: Joi.string().allow(null), // optional
});

module.exports = { registrationSchema };

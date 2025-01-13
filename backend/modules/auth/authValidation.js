const Joi = require('joi');

const registrationSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).required(),
  idNumber: Joi.string().length(9).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  idPhoto: Joi.string().allow(null),
  multiRole: Joi.array()
  .items(Joi.string().valid('citizen', 'security'))
  .required(),
securityCertificatePhoto: Joi.string().when('multiRole', {
  is: Joi.array().items('security'),
  then: Joi.required(), // Required if multiRole includes 'security'
  otherwise: Joi.forbidden(), // Forbidden otherwise
}),
});

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('citizen', 'security').required(),
  });

  return schema.validate(data);
};

module.exports = { registrationSchema, validateLogin };

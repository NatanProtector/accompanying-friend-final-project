const Joi = require("joi");

exports.reportEventSchema = Joi.object({
  eventType: Joi.string().required(),
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  instructions: Joi.string().allow(""),
  voiceCommands: Joi.string().allow(""),
  relatedUsers: Joi.array().items(Joi.string()),
});

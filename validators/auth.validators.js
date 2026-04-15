const Joi = require("joi");
const authValidatorSchema = {
    registerSchema: Joi.object({
        username: Joi.string().min(5).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
};

module.exports = { authValidatorSchema };

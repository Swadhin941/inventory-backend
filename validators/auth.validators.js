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
    }),
    updateUserInfoSchema: Joi.object({
        _id: Joi.string().required(),
        username: Joi.string().trim().min(2).required(),
        contactNo: Joi.string().trim().required(),
        role: Joi.string().valid("User", "Admin", "Manager", "Sales").required(),
        email: Joi.string().email().required(),
        accountApproved: Joi.boolean().required(),
    }),
};

module.exports = { authValidatorSchema };

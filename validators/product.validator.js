const Joi = require("joi");

const productValidatorSchema= {
    addBrandSchema: Joi.object({
        brand: Joi.string().trim().min(2).required()
    }),

    addModelSchema: Joi.object({
        brandId: Joi.string().trim().min(8).required(),
        model: Joi.string().trim().min(2).required()
    }),

    updateBrandSchema: Joi.object({
        brandId: Joi.string().trim().min(8).required(),
        brandName: Joi.string().trim().min(2).required()
    }),

}


module.exports= { productValidatorSchema }
const express = require("express");
const { addBrand, getAllBrand, updateBrand } = require("../../controller/product/product.controller");
const { runValidation } = require("../../validators");
const { productValidatorSchema } = require("../../validators/product.validator");
const productRouter = express.Router();

productRouter.post("/add-brand",runValidation(productValidatorSchema.addBrandSchema), addBrand);
productRouter.get("/get-all-brand", getAllBrand);
productRouter.put("/update-brand", updateBrand);

module.exports = productRouter;
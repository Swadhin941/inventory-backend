const express = require("express");
const { addBrand, getAllBrand, updateBrand } = require("../../controller/product/product.controller");
const { runValidation } = require("../../validators");
const { productValidatorSchema } = require("../../validators/product.validator");
const { verifyJWT } = require("../../middlewares/auth.middlewares");
const productRouter = express.Router();

productRouter.post("/add-brand",runValidation(productValidatorSchema.addBrandSchema),verifyJWT, addBrand);
productRouter.get("/get-all-brand", verifyJWT, getAllBrand);
productRouter.put("/update-brand", runValidation(productValidatorSchema.updateBrandSchema),verifyJWT, updateBrand);

module.exports = productRouter;
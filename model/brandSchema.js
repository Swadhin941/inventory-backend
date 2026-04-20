const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const {  brands } = require("./db.declarartion");

const brandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    }
})

brandSchema.index({ brand: 1 }, { unique: true });

exports.brandModel= mongoose.model(brands, brandSchema);
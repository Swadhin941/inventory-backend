const { default: mongoose, model } = require("mongoose");
const { models } = require("./db.declarartion");

const modelSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
        required: true,
    },
});

modelSchema.index({ model: 1, brand: 1 }, { unique: true });

exports.modelModel = new mongoose.model(models, modelSchema);

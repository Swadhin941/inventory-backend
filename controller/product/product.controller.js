const { brandModel } = require("../../model/brandSchema");

const addBrand = async (req, res) => {
    try {
        req.body.brand = req.body.brand.trim().toLowerCase();
        const findBrand = await brandModel.findOne({ brand: req.body.brand });
        if (findBrand) {
            return res
                .status(200)
                .send({ message: "Brand already exists", success: false });
        }
        const newBrand = await brandModel.insertOne({ brand: req.body.brand });
        return res
            .status(201)
            .send({
                message: "Brand added successfully",
                success: true,
                body: newBrand,
            });
    } catch (error) {
        return res.status(500).send({ message: error.message, success: false });
    }
};

const getAllBrand = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [brand, total] = await Promise.all([
            brandModel.find().skip(skip).limit(limit),
            brandModel.countDocuments(),
        ]);
        return res
            .status(200)
            .send({
                success: true,
                message: "Brand loaded successfully",
                totalCount: total,
                body: brand,
            });
    } catch (error) {
        return res.status(500).send({ message: error.message, success: false });
    }
};

const updateBrand = async (req, res) => {
    try {
    } catch (error) {
        return res.status(500).send({ message: error.message, success: false });
    }
};

module.exports = { addBrand, getAllBrand, updateBrand };

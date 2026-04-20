const { brandModel } = require("../../model/brandSchema");

const addBrand = async (req, res) => {
    try {
        req.body.brand = req.body.brand.trim().toLowerCase();
        const findBrand= await brandModel.findOne({brand: req.body.brand});
        if(findBrand){
            return res.status(400).send({message: "Brand already exists", success: false});
        }
        const newBrand = await new brandModel.insertOne({brand: req.body.brand}).save();
        return res.status(201).send({message: "Brand added successfully", success: true, body: newBrand});

    } catch (error) {
        return res.status(500).send({ message: error.message, success: false });
    }
};

const getAllBrand = async(req, res)=>{
    try{

    }
    catch(error){
        return res.status(500).send({message: error.message, success: false})
    }
}

const updateBrand= async(req, res)=>{
    try{

    }
    catch(error){
        return res.status(500).send({message: error.message, success: false})
    }
}

module.exports = { addBrand, getAllBrand, updateBrand };

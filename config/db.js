const { default: mongoose } = require("mongoose");
const { mongodb_URL } = require("./config");


const dbConfig = async () => {
    try {
       await mongoose.connect(mongodb_URL);
       console.log("Mongodb Connected");
    } catch (error) {
        process.exit(1);
    }
};

module.exports = { dbConfig };

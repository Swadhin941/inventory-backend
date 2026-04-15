const { default: mongoose } = require("mongoose");
const { auth, permission } = require("./db.declarartion");

const permissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: auth,
        required: true,
        unique: true
    },
    accessModule: [
        {
            type: String,
            required: true,
            enum: ["users", "products", "orders", "dashboard"],
        },
    ],
});

exports.permissionModel = mongoose.model(permission, permissionSchema);

const { default: mongoose, mongo } = require("mongoose");

const permissionSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["User", "Admin", "Manager", "Sales"],
        default: "User",
    },
    modules: {
        type: Array,
        default: [],
    }
});

exports.permissionModel = mongoose.model("permission", permissionSchema);
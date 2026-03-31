import { auth } from "./db.declarartion";

const { default: mongoose } = require("mongoose");

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "User name is required"],
        minlength: [4, "Minimum length should be 4"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    contactNo: {
        type: String,
        index: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["User", "Admin", "Manager", "Sales"],
        default: "User",
    },
    accountApproved: {
        type: Boolean,
        required: [true, "Account approved is required"],
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

authSchema.index({ role: 1, accountApproved: 1 });

export const authModel = mongoose.model(auth, authSchema);

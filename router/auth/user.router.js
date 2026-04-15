const express = require("express");
const { runValidation } = require("../../validators");
const { authValidatorSchema } = require("../../validators/auth.validators");
const { login, register, validateInfo, allUserList, userStatistics } = require("../../controller/auth/user.controller");
const { verifyJWT } = require("../../middlewares/auth.middlewares");

// Auth router

const userRouter = express.Router();
userRouter.post(
    "/login",
    runValidation(authValidatorSchema.loginSchema),
    login,
);
userRouter.post(
    "/register",
    runValidation(authValidatorSchema.registerSchema),
    register,
);

userRouter.get('/validate-info',verifyJWT, validateInfo);
userRouter.get('/all-list', allUserList);
userRouter.get("/user-statistics", userStatistics);

module.exports = userRouter;

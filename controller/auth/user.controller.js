const { default: mongoose } = require("mongoose");
const {
    bcrypt,
    saltRounds,
    jwt,
    access_token,
} = require("../../config/config");
const { authModel } = require("../../model/authSchemas");

// Login block

const login = async (req, res) => {
    try {
        const findEmail = await authModel.findOne({
            email: req.body.email,
        });

        if (!findEmail) {
            return res.status(404).send({ message: "User not found!" });
        }

        const passwordMatch = await bcrypt.compare(
            req.body.password,
            findEmail.password,
        );

        if (!passwordMatch) {
            return res.status(401).send({ message: "Wrong Password!" });
        }
        if (findEmail.accountApproved === false) {
            return res.status(401).send({ message: "Your account is not approved yet!", success: false });
        }

        const tokenPayload = {
            username: findEmail.username,
            role: findEmail.role,
            accountApproved: findEmail.accountApproved,
            email: findEmail.email,
            userId: findEmail._id.toString(),
        };

        const tokenCreation = jwtToken(tokenPayload);

        return res.status(200).send({
            success: true,
            body: tokenPayload,
            token: tokenCreation,
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

// Register block

const register = async (req, res) => {
    try {
        const existedEmail = await authModel.findOne({ email: req.body.email });
        if (existedEmail) {
            return res.status(400).send({ message: "Email is already taken!" });
        } else {
            const hash = await bcrypt.hash(req.body.password, saltRounds);

            const user = await authModel.create({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            });

            return res.status(200).send({
                success: true,
                message: "User created successfully",
            });
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

const passwordUpdate = async (req, res) => {
    try {
        const hashPass = await bcrypt.hash(req.body.password, saltRounds);
        const updateData = {
            $set: {
                password: hashPass,
            },
        };
        const result = await authModel.updateOne(
            { email: req.body.email },
            updateData,
        );
        if (result.modifiedCount >= 1) {
            return res
                .status(201)
                .send({ message: "Password updated successfully" });
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

const jwtToken = (tokenInfo) => {
    const jwtToken = jwt.sign(tokenInfo, access_token, { expiresIn: "1h" });
    return jwtToken;
};

// Validate user information
const validateInfo = async (req, res) => {
    try {
        let userInfo = await authModel.findOne(
            { email: req.decoded.email },
            {
                email: 1,
                username: 1,
                _id: 0,
                role: 1,
                accountApproved: 1,
            },
        );
        if (!userInfo) {
            return res.status(404).send({ message: "User not found" });
        }
        if(userInfo.accountApproved === false){
            return res.status(401).send({ message: "Your account is not approved yet!", success: false, body: null });
        }
        return res.status(200).send({
            success: true,
            body: userInfo,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const allUserList = async (req, res) => {
    try {
        const search = req.query.search || "All";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let findCondition = {};
        if(search.toLowerCase()==="all"){
            findCondition= {};
        }
        else{
            findCondition= {
                role: search
            }
        }
        const [user, total] = await Promise.all([
            authModel.find(findCondition, { password: 0 }).skip(skip).limit(limit),
            authModel.countDocuments(),
        ]);
        return res.status(200).send({
            success: true,
            message: "User loaded successfully",
            total: total,
            body: user,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const userStatistics = async (req, res) => {
    try {
        const [totalUserCount, activeUser, deactivate, admin] =
            await Promise.all([
                authModel.find().countDocuments(),
                authModel.find({ accountApproved: true }).countDocuments(),
                authModel.find({ accountApproved: false }).countDocuments(),
                authModel.find({ role: "Admin" }).countDocuments(),
            ]);
        // console.log(totalUserCount)
        return res.status(200).send({
            success: true,
            message: "User statistics loaded successfully",
            body: {
                totalUser: totalUserCount,
                activeUser: activeUser,
                deactivateUser: deactivate,
                admin,
            },
        });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

const getAllRoles = (req, res) => {
    try {
        const roles = ["User", "Admin", "Manager", "Sales"];
        return res.status(200).send({ success: true, body: roles });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        if(req.decoded.email === req.body.email){
            return res.status(403).send({message: "You can't update your own information", success: false, body: null})
        }
        const updateData = {
            username: req.body.username,
            contactNo: req.body.contactNo,
            role: req.body.role,
            accountApproved: req.body.accountApproved,
        };
        const filter = {
            $and: [
                { email: req.body.email },
                { _id: new mongoose.Types.ObjectId(req.body._id) },
            ],
        };
        const result = await authModel.updateOne(
            filter,
            { $set: updateData },
            { upsert: false },
        );
        if (result.modifiedCount >= 1) {
            return res
                .status(200)
                .send({
                    success: true,
                    message: "User information updated successfully",
                    body: req.body,
                });
        } else {
            return res
                .status(200)
                .send({
                    success: true,
                    message: "User information not updated",
                    body: null,
                });
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

module.exports = {
    login,
    register,
    passwordUpdate,
    validateInfo,
    allUserList,
    userStatistics,
    getAllRoles,
    updateUserInfo,
};

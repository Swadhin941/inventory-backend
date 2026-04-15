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

        const tokenPayload = {
            username: findEmail.username,
            role: findEmail.role,
            approvedStatus: findEmail.accountApproved,
            email: findEmail.email,
            userId: findEmail._id.toString(),
        };

        const tokenCreation = jwtToken(tokenPayload);

        return res.status(200).send({
            success: true,
            body: {
                ...tokenPayload,
            },
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
        const userInfo = await authModel.findOne(
            { email: req.decoded.email },
            {
                email: 1,
                username: 1,
                _id: 0,
                role: 1,
                accountApproved: 1,
                createdAt: 0,
            },
        );
        if (!userInfo) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send(userInfo);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const allUserList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [user, total] = await Promise.all([
            authModel.find({}, { password: 0 }).skip(skip).limit(limit),
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
        const [totalUserCount, activeUser, deactivate, admin]= Promise.all([
            await authModel.find().countDocuments(),
            await authModel.find({accountApproved: true}).countDocuments(),
            await authModel.find({accountApproved: false}).countDocuments(),
            await authModel.find({role: "Admin"}).countDocuments()
        ])
        return res.status(200).send({
            totalUser: totalUserCount,
            activeUser: activeUser,
            deactivateUser: deactivate,
            admin
        })
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports = { login, register, passwordUpdate, validateInfo, allUserList, userStatistics };

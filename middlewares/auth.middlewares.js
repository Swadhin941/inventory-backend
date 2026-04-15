const { jwt, access_token } = require("../config/config");

const verifyJWT = (req, res, next) => {
    console.log(req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorize request!" });
    }
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, access_token, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorize request!" });
        }
        req.decoded = decoded;
        next();
    });
};

const forbiddenAccess = (req, res, next) => {
    const email = req.query.user;
    if (req.decoded.email !== email) {
        return req.status(403).send({ message: "Forbidden access!" });
    }
    next();
};

module.exports = { verifyJWT, forbiddenAccess };

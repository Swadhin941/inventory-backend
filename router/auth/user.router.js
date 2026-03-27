const { express } = require("../../config/config");

const router = express.Router();
router.get("/login");
router.post("/register");

module.exports = { userRouter: router };

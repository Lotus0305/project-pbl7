const router = require("express").Router();
const authController = require("../controller/authController");
const middlewareController = require("../controller/middlewareController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh_token", authController.refreshToken);
router.post("/logout", middlewareController.verifyToken, authController.logout);

module.exports = router;

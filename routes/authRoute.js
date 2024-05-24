const router = require("express").Router();
const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh_token", authController.refreshToken);
router.post("/logout", middlewareController.verifyToken, authController.logout);

module.exports = router;

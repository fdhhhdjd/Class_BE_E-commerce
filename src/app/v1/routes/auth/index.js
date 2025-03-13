const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const passport = require("../../../share/utils/passport.util");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/login-google", AuthController.loginGoogle);
router.get("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);

// Google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.use(AuthMiddleware.checkRefreshToken);
router.get("/renew-token", AuthController.renewTokenByRefreshToken);

module.exports = router;

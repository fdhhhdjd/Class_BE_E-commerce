const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const passport = require("../../../share/utils/passport.util");

const router = express.Router();

// --- Users
router.post("/register", AuthController.register);
router.post("/new-register", AuthController.NewRegister);
router.get(
  "/verify-email/:token/:email/:userId/:expires",
  AuthController.verifyEmail
);

router.post("/login", AuthController.login);
router.post("/login-google", AuthController.loginGoogle);
router.get("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
// Passport
router.get("/google", AuthController.LoginGooglePassport);
router.get("/logout", AuthController.logoutPassport);
router.get("/profile", AuthController.getProfilePassport);

// --- Admin
router.post("/login-admin", AuthController.loginAdmin);

router.use(AuthMiddleware.checkRefreshToken);
router.get("/renew-token", AuthController.renewTokenByRefreshToken);

module.exports = router;

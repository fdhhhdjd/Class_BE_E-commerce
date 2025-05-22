const express = require("express");
const OTPCodeController = require("../../controllers/otp_code.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(AuthMiddleware.checkToken);

router.post("/create-otp-code", OTPCodeController.createOtpCodeHandler);
router.post("/verify-otp-code", OTPCodeController.verifyOtpCodeHandler);

module.exports = router;

const otpCodeService = require("../services/otp_code.service");

class OTPCodeController {
  async createOtpCodeHandler(req, res) {
    try {
      const result = await otpCodeService.createOtpCode(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async verifyOtpCodeHandler(req, res) {
    try {
      const result = await otpCodeService.verifyOtpCode(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new OTPCodeController();

const { totp } = require("otplib");
const appConfig = require("../configs/app.conf");

class OTPUtil {
  constructor() {
    this.secret = appConfig.OtpSecret;
  }

  generateSecret() {
    return totp.generate(this.secret);
  }

  verifyOtp(userInputOtp) {
    const isValid = totp.check(userInputOtp, this.secret);

    if (isValid) {
      console.log("OTP hợp lệ");
      return true;
    } else {
      console.log("OTP không hợp lệ hoặc đã hết hạn");
      return false;
    }
  }
}

module.exports = new OTPUtil();

const emailUtil = require("../../share/utils/email.util");
const OTPUtil = require("../../share/utils/otp.util");
const TimeUtil = require("../../share/utils/time.util");
const otpCodeModel = require("../models/otp_code.model");

class OTPCodeService {
  async createOtpCode(req) {
    // B2. Get userId from token
    const { userId, email } = req.infoUserByToken;

    // B3. Generate OTP code
    const otpCode = OTPUtil.generateSecret();

    // B4. Set expiration time to 15 minutes from now
    const expirationMinutes = 15;
    const expiresAt = TimeUtil.createDateTimeWithOffset(expirationMinutes); // 15 minutes in milliseconds

    // B5. Save OTP code to the database
    await otpCodeModel.createOTPCode(userId, otpCode, expiresAt);

    // emailUtil.sendEmail({
    //   to: email,
    //   subject: "Your OTP Code",
    //   text: `Hello,\n\nYour OTP code is:\n\n${otpCode}\n\nThis code will expire in ${expirationMinutes} minutes.\n\nBest regards,\nClass02`,
    //   html: `<p>Hello,</p><p>Your OTP code is:</p><p><strong>${otpCode}</strong></p><p>This code will expire in <strong>${expirationMinutes} minutes</strong>.</p><p>Best regards,<br>Class O2</p>`,
    // });

    // B6. Return response
    return {
      message: "OTP code hade been sent to your email",
      data: {
        userId: userId,
        email,
        otpCode,
      },
    };
  }

  async verifyOtpCode(req) {
    const { userId } = req.infoUserByToken;
    const { otpCode } = req.body;

    if (!otpCode) {
      throw new Error("OTP code must be provided");
    }

    // Check OTP expired
    const otpCodeData = await otpCodeModel.isOTPCodeExpired(userId, otpCode);
    if (otpCodeData) {
      throw new Error("OTP code has expired");
    }

    // B5. Mark OTP code as used
    await otpCodeModel.updateIsUsed(userId, otpCode);

    return {
      message: "OTP code verified successfully",
      data: {
        userId: userId,
      },
    };
  }
}

module.exports = new OTPCodeService();

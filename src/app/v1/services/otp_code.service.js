const emailUtil = require("../../share/utils/email.util");
const OTPUtil = require("../../share/utils/otp.util");
const TimeUtil = require("../../share/utils/time.util");
const otpCodeModel = require("../models/otp_code.model");
const redisDB = require("../../share/database/redis.database");

class OTPCodeService {
  async createOtpCode(req) {
    // B2. Get userId from token
    const { userId, email } = req.infoUserByToken;

    const isAllowed = await this.canSendOtp(userId);

    if (!isAllowed.allowed) {
      throw new Error(isAllowed.message);
    }

    // B3. Generate OTP code
    const otpCode = OTPUtil.generateSecret();

    // B4. Set expiration time to 15 minutes from now
    const expirationMinutes = 15;
    const expiresAt = TimeUtil.createDateTimeWithOffset(expirationMinutes); // 15 minutes in milliseconds

    // B5. Save OTP code to the database
    await otpCodeModel.createOTPCode(userId, otpCode, expiresAt);

    emailUtil.sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Hello,\n\nYour OTP code is:\n\n${otpCode}\n\nThis code will expire in ${expirationMinutes} minutes.\n\nBest regards,\nClass02`,
      html: `<p>Hello,</p><p>Your OTP code is:</p><p><strong>${otpCode}</strong></p><p>This code will expire in <strong>${expirationMinutes} minutes</strong>.</p><p>Best regards,<br>Class O2</p>`,
    });

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

  async canSendOtp(userId) {
    const countKey = `otp_count:${userId}`;
    const lastSendKey = `otp_last_send:${userId}`;
    const blockKey = `otp_blocked:${userId}`;

    // 1. Kiểm tra tài khoản có bị khóa không
    const isBlocked = await redisDB.executeCommand("exists", blockKey);

    if (isBlocked) {
      return {
        allowed: false,
        message: "Tài khoản bị khóa 30 phút do gửi quá nhiều OTP.",
      };
    }

    // 2. Tăng biến đếm OTP và set TTL nếu lần đầu
    let count = await redisDB.executeCommand("incr", countKey);
    if (count === 1) {
      await redisDB.executeCommand("expire", countKey, 300); // TTL 5 phút (300 giây)
    }

    // 3. Xử lý các trường hợp gửi OTP
    if (count <= 3) {
      await redisDB.executeCommand("set", lastSendKey, Date.now(), "EX", 300); // Lưu timestamp, TTL 5 phút
      return { allowed: true, message: "Gửi OTP thành công." };
    } else if (count <= 5) {
      const lastSend = await redisDB.executeCommand("get", lastSendKey);
      const now = Date.now();
      if (lastSend && now - parseInt(lastSend) < 10000) {
        // chưa đủ 10s
        return {
          allowed: false,
          message: "Bạn cần chờ 10 giây mới được gửi OTP tiếp theo.",
        };
      }
      await redisDB.executeCommand("set", lastSendKey, now, "EX", 300);
      return {
        allowed: true,
        message: "Gửi OTP thành công, chú ý giới hạn gửi.",
      };
    } else {
      await redisDB.executeCommand("set", blockKey, 1, "EX", 1800); // Khóa 30 phút
      return {
        allowed: false,
        message: "Tài khoản bị khóa 30 phút do gửi quá nhiều OTP.",
      };
    }
  }
}

module.exports = new OTPCodeService();

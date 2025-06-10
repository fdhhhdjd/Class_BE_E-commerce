const tokenConfig = require("../../share/configs/token.conf");
const authConstants = require("../../share/constants/auth.constants");
const EmailUtil = require("../../share/utils/email.util");
const PasswordUtils = require("../../share/utils/password.util");
const TokenUtil = require("../../share/utils/token.util");
const AuthValidate = require("../../share/validates/auth.validate");
const UserModel = require("../models/user.model");
const passport = require("../../share/utils/passport.util");
const redisDB = require("../../share/database/redis.database");
const TimeUtil = require("../../share/utils/time.util");
const EmailVerificationTokenModel = require("../models/email_verification_token.model");
const appConfig = require("../../share/configs/app.conf");
const deviceService = require("./device.service");
class AuthService {
  async register(body) {
    // B1 Get data from body
    const { email, password } = body;

    // B2. Check validate email and password
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const checkEmail = AuthValidate.isEmailValid(email);

    if (!checkEmail) {
      throw new Error("Invalid email");
    }

    // B3. Check email exist or not exist
    const user = await UserModel.findOneByEmail({ email });

    // B4. If account exist
    if (user) {
      throw new Error("Email already exist");
    }

    // B4. If account not exist
    // B5 Hash password
    const hashPassword = PasswordUtils.hash({ password });

    // B6. Save account to database
    const newUser = await UserModel.create({ email, password: hashPassword });

    return {
      user: {
        userId: newUser.user_id,
        email: newUser.email,
      },
      message: "User registered successfully",
    };
  }

  async newRegister(body) {
    const { email, password } = body;

    // B2. Check validate email and password
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const checkEmail = AuthValidate.isEmailValid(email);

    if (!checkEmail) {
      throw new Error("Invalid email");
    }

    // B3. Check email exist or not exist
    const user = await UserModel.findOneByEmail({ email });

    // B4. If account exist
    if (user) {
      throw new Error("Email already exist");
    }

    const hashPassword = PasswordUtils.hash({ password });
    const token = TokenUtil.randomToken();
    const expires = TimeUtil.createDateTimeWithOffset(30); // Token hết hạn sau 30 phút

    const newUser = await UserModel.newCreate({
      email,
      password: hashPassword,
      is_active: false,
    });

    const host =
      appConfig.NodeEnv === "development" ? "localhost" : "localhost";

    const port =
      appConfig.NodeEnv === "development" ? appConfig.Port : appConfig.PortFe;

    const LinkVerifyEmail = `http://${host}:${port}/auth/api/auth/verify-email/${token}/${email}/${
      newUser.user_id
    }/${expires.getTime()}`;

    await EmailVerificationTokenModel.createToken({
      userId: newUser.user_id,
      token,
      expiresAt: expires,
    });

    // B7. Send email verification
    EmailUtil.sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Hello ${email},\n\nPlease verify your email by clicking the link below:\n\n${LinkVerifyEmail}\n\nThis link will expire in 30 minutes.\n\nBest regards,\nClass02`,
      html: `<p>Hello ${email},</p><p>Please verify your email by clicking the link below:</p><p><a href="${LinkVerifyEmail}">Verify Email</a></p><p>This link will expire in 30 minutes.</p><p>Best regards,<br>Class O2</p>`,
    });

    return {
      user: {
        userId: newUser.user_id,
        email: newUser.email,
      },
      linkVerifyEmail: LinkVerifyEmail,
      message:
        "User registered successfully. Please check your email to verify your account.",
    };
  }

  async verifyEmail(data, res) {
    const { token, email, userId, expires } = data;

    if (!token || !email || !userId || !expires) {
      throw new Error("Invalid token or email or userId or expires");
    }

    // B2. Check token expire
    const currentTime = new Date().getTime();
    if (currentTime > expires) {
      throw new Error("Token expired");
    }

    const checkToken = await EmailVerificationTokenModel.getTokenByUserId({
      userId,
      token,
    });

    // B3. If token not exist or used
    if (!checkToken || checkToken.used) {
      throw new Error("Token not exist or used");
    }

    // B3. Get user by email
    const user = await UserModel.findOneByEmailNotIsActive({ email });

    // If user not exist
    if (!user) {
      throw new Error("User not exist");
    }

    await Promise.all([
      EmailVerificationTokenModel.updateToken({
        used: true,
        token,
      }),
      UserModel.updateUser({ user_id: userId, is_active: true }),
    ]);

    const accessToken = TokenUtil.generateAccessToken({
      payload: {
        userId: user.user_id,
        email: user.email,
        role: user.role_name,
        roleId: user.role_id,
      },
      secret: tokenConfig.AccessSecret,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      payload: {
        userId: user.user_id,
        email: user.email,
        role: user.role_name,
        roleId: user.role_id,
      },
      secret: tokenConfig.RefreshSecret,
    });

    res.cookie(authConstants.KeyCookie.RefreshToken, refreshToken, {
      httpOnly: true,
      secure: true, // Bắt buộc nếu dùng SameSite=None
      sameSite: "none", // Cho phép cross-site
      domain: "localhost", // Thay bằng domain của bạn (hoặc "localhost" cho dev)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: "Email verified successfully",
      accessToken: accessToken,
      user_id: user.user_id,
      role: user.role_name,
    };
  }

  async resendVerifyEmail(data) {
    const { email, expired } = data;

    if (!expired || !email) {
      throw new Error("Email and password are required");
    }

    const currentTime = new Date().getTime();
    if (currentTime < expired) {
      throw new Error("You can only resend email after 30 minutes");
    }

    const checkEmail = AuthValidate.isEmailValid(email);

    if (!checkEmail) {
      throw new Error("Invalid email");
    }

    // B3. Check email exist or not exist
    const user = await UserModel.findOneByEmailToResend(email);

    // B4. If account exist
    if (!user) {
      throw new Error("Please register first");
    }

    const token = TokenUtil.randomToken();
    const expires = TimeUtil.createDateTimeWithOffset(30); // Token hết hạn sau 30 phút

    const host =
      appConfig.NodeEnv === "development" ? "localhost" : "localhost";

    const port =
      appConfig.NodeEnv === "development" ? appConfig.Port : appConfig.PortFe;

    const LinkVerifyEmail = `http://${host}:${port}/auth/api/auth/verify-email/${token}/${email}/${
      user.user_id
    }/${expires.getTime()}`;

    await EmailVerificationTokenModel.createToken({
      userId: user.user_id,
      token,
      expiresAt: expires,
    });

    // B7. Send email verification
    EmailUtil.sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Hello ${email},\n\nPlease verify your email by clicking the link below:\n\n${LinkVerifyEmail}\n\nThis link will expire in 30 minutes.\n\nBest regards,\nClass02`,
      html: `<p>Hello ${email},</p><p>Please verify your email by clicking the link below:</p><p><a href="${LinkVerifyEmail}">Verify Email</a></p><p>This link will expire in 30 minutes.</p><p>Best regards,<br>Class O2</p>`,
    });

    return {
      user: {
        userId: user.user_id,
        email: user.email,
      },
      linkVerifyEmail: LinkVerifyEmail,
      message:
        "Registration email resent successfully. Please check your email to verify your account.",
    };
  }

  async login(body, res, deviceId) {
    // B1 Get data from body
    const { identify, password } = body;

    // B2. Check type login
    const checkTypeLogin = AuthValidate.checkTypeLogin(identify);

    // B3. Check Validate
    let user;
    if (checkTypeLogin === authConstants.LoginType.Email) {
      const checkEmail = AuthValidate.isEmailValid(identify);
      if (!checkEmail) {
        throw new Error("Invalid email");
      }
      // B4. Check email exist or not exist
      user = await UserModel.findOneByEmail({ email: identify });
    } else if (checkTypeLogin === authConstants.LoginType.Username) {
      const checkUsername = AuthValidate.isUsernameValid(identify);
      if (checkUsername) {
        throw new Error("Invalid username");
      }
      // B4. Check email exist or not exist
      user = await UserModel.findOneByUsername({ username: identify });
    }

    // If account not exist
    if (!user) {
      throw new Error("Account not exist");
    }

    // B5. Check Compare password
    const comparePassword = PasswordUtils.compare({
      password,
      hash: user.password,
    });

    // If user enter password incorrect
    if (!comparePassword) {
      throw new Error("Password is incorrect");
    }

    // Update last login
    await UserModel.updateUser({
      user_id: user.user_id,
      last_login: new Date(),
    });
    // B2. Get latest user info (without role if you separate it in SQL or manually)
    const updatedUser = await UserModel.getUser({ user_id: user.user_id });

    // B3. Remove role from cache data before saving (just user fields)
    const { role_id, role_name, permissions, ...userCacheData } = updatedUser; // destructure to exclude role

    // B4. Flatten user object and update cache
    const flatUser = Object.entries(userCacheData).flat();
    await redisDB.executeCommand("hset", `user:${user.user_id}`, ...flatUser);

    // If user enter password correct
    // B6. Create token
    const accessToken = TokenUtil.generateAccessToken({
      payload: {
        userId: user.user_id,
        email: user.email,
        role: user.role_name,
        roleId: user.role_id,
      },
      secret: tokenConfig.AccessSecret,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      payload: {
        userId: user.user_id,
        email: user.email,
        role: user.role_name,
        roleId: user.role_id,
      },
      secret: tokenConfig.RefreshSecret,
    });

    res.cookie(authConstants.KeyCookie.RefreshToken, refreshToken, {
      httpOnly: true,
      secure: true, // Bắt buộc nếu dùng SameSite=None
      sameSite: "none", // Cho phép cross-site
      domain: "localhost", // Thay bằng domain của bạn (hoặc "localhost" cho dev)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const device = await deviceService.upsertDevice(user.user_id, deviceId, {
      platform: "web",
    });

    return {
      message: "Login successfully",
      accessToken: accessToken,
      user_id: user.user_id,
      role: user.role_name,
      deviceToken: device.device_token,
    };
  }

  async loginAdmin(body, res, deviceId) {
    // B1 Get data from body
    const { identify, password, type } = body;

    if (Number(type) === authConstants.Type.Identify) {
      // B2. Check type login
      const checkTypeLogin = AuthValidate.checkTypeLogin(identify);

      // B3. Check Validate
      let user;
      if (checkTypeLogin === authConstants.LoginType.Email) {
        const checkEmail = AuthValidate.isEmailValid(identify);
        if (!checkEmail) {
          throw new Error("Invalid email");
        }
        // B4. Check email exist or not exist
        user = await UserModel.findOneByEmail({ email: identify });
      } else if (checkTypeLogin === authConstants.LoginType.Username) {
        const checkUsername = AuthValidate.isUsernameValid(identify);
        if (checkUsername) {
          throw new Error("Invalid username");
        }
        // B4. Check email exist or not exist
        user = await UserModel.findOneByUsername({ username: identify });
      }

      // If account not exist
      if (!user) {
        throw new Error("Account not exist");
      }

      if (user.role_name === authConstants.Role.User) {
        throw new Error("You are not admin");
      }

      // B5. Check Compare password
      const comparePassword = PasswordUtils.compare({
        password,
        hash: user.password,
      });

      // If user enter password incorrect
      if (!comparePassword) {
        throw new Error("Password is incorrect");
      }

      // Update last login
      await UserModel.updateUser({
        user_id: user.user_id,
        last_login: new Date(),
      });
      // B2. Get latest user info (without role if you separate it in SQL or manually)
      const updatedUser = await UserModel.getUser({ user_id: user.user_id });

      // B3. Remove role from cache data before saving (just user fields)
      const { role_id, role_name, permissions, ...userCacheData } = updatedUser; // destructure to exclude role

      // B4. Flatten user object and update cache
      const flatUser = Object.entries(userCacheData).flat();
      await redisDB.executeCommand("hset", `user:${user.user_id}`, ...flatUser);

      // If user enter password correct
      // B6. Create token
      const accessToken = TokenUtil.generateAccessToken({
        payload: {
          userId: user.user_id,
          email: user.email,
          role: user.role_name,
          roleId: user.role_id,
        },
        secret: tokenConfig.AccessSecret,
      });

      const refreshToken = TokenUtil.generateRefreshToken({
        payload: {
          userId: user.user_id,
          email: user.email,
          role: user.role_name,
          roleId: user.role_id,
        },
        secret: tokenConfig.RefreshSecret,
      });

      res.cookie(authConstants.KeyCookie.RefreshToken, refreshToken, {
        httpOnly: true,
        secure: true, // Bắt buộc nếu dùng SameSite=None
        sameSite: "none", // Cho phép cross-site
        domain: "localhost", // Thay bằng domain của bạn (hoặc "localhost" cho dev)
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const device = await deviceService.upsertDevice(user.user_id, deviceId, {
        platform: "web",
      });

      return {
        message: "Login successfully",
        accessToken: accessToken,
        user_id: user.user_id,
        role: user.role_name,
        deviceToken: device.device_token,
      };
    } else if (Number(type) === authConstants.Type.Social) {
      const email = identify;

      // B2. Check validate email
      const checkEmail = AuthValidate.isEmailValid(email);
      if (!checkEmail) {
        throw new Error("Invalid email");
      }

      // B3. Check email exist or not exist
      let user = await UserModel.findOneByEmail({ email });

      // If account not exist
      if (!user) {
        throw new Error("Account not exist");
      }

      if (user.role_name === authConstants.Role.User) {
        throw new Error("You are not admin");
      }

      // B2. Get latest user info (without role if you separate it in SQL or manually)
      const updatedUser = await UserModel.getUser({ user_id: user.user_id });

      // B3. Remove role from cache data before saving (just user fields)
      const { role_id, role_name, permissions, ...userCacheData } = updatedUser; // destructure to exclude role

      // B4. Flatten user object and update cache
      const flatUser = Object.entries(userCacheData).flat();
      await redisDB.executeCommand("hset", `user:${user.user_id}`, ...flatUser);

      // B4. Create token
      const accessToken = TokenUtil.generateAccessToken({
        payload: {
          userId: user.user_id,
          email: user.email,
        },
        secret: tokenConfig.AccessSecret,
      });

      const refreshToken = TokenUtil.generateRefreshToken({
        payload: {
          userId: user.user_id,
          email: user.email,
        },
        secret: tokenConfig.RefreshSecret,
      });

      res.cookie(authConstants.KeyCookie.RefreshToken, refreshToken, {
        httpOnly: true,
        secure: true, // Bắt buộc nếu dùng SameSite=None
        sameSite: "none", // Cho phép cross-site
        domain: "localhost", // Thay bằng domain của bạn (hoặc "localhost" cho dev)
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        message: "Login social successfully",
        accessToken: accessToken,
        user_id: user.user_id,
        role: user.role_name,
      };
    } else {
      throw new Error("Invalid type login");
    }
  }

  async logout(res) {
    res.clearCookie(authConstants.KeyCookie.RefreshToken);
    return {
      message: "Logout successfully",
    };
  }

  async forgotPassword(body) {
    // B1 Get data from body
    const { email } = body;

    // B2. Check validate email
    const checkEmail = AuthValidate.isEmailValid(email);

    // If email invalid error
    if (!checkEmail) {
      throw new Error("Invalid email");
    }

    // B3. Check email exist or not exist
    const user = await UserModel.findOneByEmail({ email });

    // If email not exist
    if (!user) {
      throw new Error("Email not exist");
    }

    // B4. Random new password
    const newPassword = PasswordUtils.generateRandomPassword();

    // B5. Hash new password
    const hashPassword = PasswordUtils.hash({ password: newPassword });

    // B6. Update new password to database
    UserModel.updatePassword({ user_id: user.user_id, password: hashPassword });

    // B7. Send email new password
    EmailUtil.sendEmail({
      to: email,
      subject: "Your New Password",
      text: `Hello ${user.email},\n\nYour password has been reset. Your new password is:\n\n${newPassword}\n\nPlease change your password after logging in.\n\nBest regards,\nClass02`,
      html: `<p>Hello ${user.email},</p><p>Your password has been reset. Your new password is:</p><p><strong>${newPassword}</strong></p><p>Please change your password after logging in.</p><p>Best regards,<br>Class O2</p>`,
    });

    // B8. Return message
    return {
      message: "Forgot password",
    };
  }

  async renewTokenByRefreshToken(req) {
    // B1. Get info user by refetch token
    const { userId, email } = req.infoUserByRefetchToken;

    // B2. Create token
    const accessToken = TokenUtil.generateAccessToken({
      payload: {
        userId,
        email,
      },
      secret: tokenConfig.AccessSecret,
    });

    const device = await deviceService.upsertDevice(userId, req.deviceId, {});

    return {
      message: "Renew token successfully",
      accessToken,
      deviceToken: device.device_token,
    };
  }

  async loginGoogle(body, res, deviceId) {
    // B1 Get data from body
    const { email } = body;

    // B2. Check validate email
    const checkEmail = AuthValidate.isEmailValid(email);
    if (!checkEmail) {
      throw new Error("Invalid email");
    }

    // B3. Check email exist or not exist
    let user = await UserModel.findOneByEmail({ email });

    // If account not exist
    if (!user) {
      const passwordRandom = PasswordUtils.generateRandomPassword();

      const hashPassword = PasswordUtils.hash({ password: passwordRandom });

      const newUser = await UserModel.create({ email, password: hashPassword });

      // B7. Send email new password
      EmailUtil.sendEmail({
        to: email,
        subject: "Your New Password",
        text: `Hello ${newUser.email},\n\nYour password has been reset. Your new password is:\n\n${passwordRandom}\n\nPlease change your password after logging in.\n\nBest regards,\nClass02`,
        html: ` <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center;">Password Reset Successful</h2>
                <p>Hello <strong>${email}</strong>,</p>
                <p>Your password has been reset. Your new password is:</p>
                <div style="background: #f8f9fa; padding: 10px; font-size: 18px; font-weight: bold; text-align: center; border-radius: 5px; margin: 10px 0;">${passwordRandom}</div>
                <p>Please change your password after logging in for security reasons.</p>
                <p>Best regards,<br><strong>Class02</strong></p>
                <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
                    If you did not request this change, please contact our support team.
                </div>
            </div>`,
      });
      user = newUser;
    }

    // B2. Get latest user info (without role if you separate it in SQL or manually)
    const updatedUser = await UserModel.getUser({ user_id: user.user_id });

    // B3. Remove role from cache data before saving (just user fields)
    const { role_id, role_name, permissions, ...userCacheData } = updatedUser; // destructure to exclude role

    // B4. Flatten user object and update cache
    const flatUser = Object.entries(userCacheData).flat();
    await redisDB.executeCommand("hset", `user:${user.user_id}`, ...flatUser);

    // B4. Create token
    const accessToken = TokenUtil.generateAccessToken({
      payload: {
        userId: user.user_id,
        email: user.email,
      },
      secret: tokenConfig.AccessSecret,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      payload: {
        userId: user.user_id,
        email: user.email,
      },
      secret: tokenConfig.RefreshSecret,
    });

    res.cookie(authConstants.KeyCookie.RefreshToken, refreshToken, {
      httpOnly: true,
      secure: true, // Bắt buộc nếu dùng SameSite=None
      sameSite: "none", // Cho phép cross-site
      domain: "localhost", // Thay bằng domain của bạn (hoặc "localhost" cho dev)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const device = await deviceService.upsertDevice(user.user_id, deviceId, {});

    return {
      message: "Login Google successfully",
      accessToken: accessToken,
      user_id: user.user_id,
      role: user.role_name,
      deviceToken: device.device_token,
    };
  }

  // Passport
  loginSocialPassport(type) {
    return (req, res, next) => {
      passport.authenticate(type, {
        scope: ["profile", "email"],
        prompt: "select_account",
      })(req, res, next);
    };
  }

  logoutPassport(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Lỗi khi xóa session:", err);
          return res.status(500).json({ message: "Logout Fail!" });
        }
        res.json({ message: "Logout successful!" });
      });
    });
  }

  getProfilePassport(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return {
      message: "Get profile successfully",
      user: req.user,
    };
  }
}

module.exports = new AuthService();

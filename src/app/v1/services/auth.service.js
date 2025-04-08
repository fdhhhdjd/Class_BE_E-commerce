const tokenConfig = require("../../share/configs/token.conf");
const authConstants = require("../../share/constants/auth.constants");
const EmailUtil = require("../../share/utils/email.util");
const PasswordUtils = require("../../share/utils/password.util");
const TokenUtil = require("../../share/utils/token.util");
const AuthValidate = require("../../share/validates/auth.validate");
const UserModel = require("../models/user.model");
const passport = require("../../share/utils/passport.util");
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

  async login(body, res) {
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
      secure: false,
      sameSite: "none",
    });

    return {
      message: "Login successfully",
      accessToken: accessToken,
      role: user.role_name,
    };
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

    return {
      message: "Renew token successfully",
      accessToken,
    };
  }

  async loginGoogle(body, res) {
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
      secure: false,
      sameSite: "none",
    });

    return {
      message: "Login Google successfully",
      accessToken: accessToken,
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

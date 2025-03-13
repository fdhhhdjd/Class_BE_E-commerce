const jwt = require("jsonwebtoken");
const authConstants = require("../constants/auth.constants");

class TokenUtil {
  static generateAccessToken({
    payload,
    secret,
    expiresIn = authConstants.JwtTime.AccessToken,
  }) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static generateRefreshToken({
    payload,
    secret,
    expiresIn = authConstants.JwtTime.RefreshToken,
  }) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken({ token, secret }) {
    return jwt.verify(token, secret);
  }

  static removeBearerPrefix(token) {
    if (token.startsWith("Bearer ")) {
      return token.replace("Bearer ", "");
    }
    return token;
  }
}

module.exports = TokenUtil;

const authConstants = {
  LoginType: {
    Email: 10,
    Username: 20,
  },

  Role: {
    User: "user",
  },

  Type: {
    Identify: 0,
    Social: 1,
  },

  JwtTime: {
    AccessToken: "15m",
    RefreshToken: "7d",
  },

  JwtMessage: {
    TokenExpiredError: "TokenExpiredError",
    TokenSignatureError: "JsonWebTokenError",
  },

  KeyCookie: {
    RefreshToken: "auth_refresh_token",
  },
};

module.exports = authConstants;

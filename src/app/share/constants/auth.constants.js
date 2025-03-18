const authConstants = {
  LoginType: {
    Email: 10,
    Username: 20,
  },

  Role: {
    User: "user",
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

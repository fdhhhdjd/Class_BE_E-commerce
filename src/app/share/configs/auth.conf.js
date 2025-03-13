const authConfig = {
  Google: {
    ClientId: process.env.GOOGLE_CLIENT_ID,
    ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    CallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  Session: {
    Secret: process.env.SESSION_SECRET,
  },
};

module.exports = authConfig;

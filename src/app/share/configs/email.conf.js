const emailConfig = {
  Host: process.env.EMAIL_HOST,
  Port: process.env.EMAIL_PORT,
  User: process.env.EMAIL_USER,
  Password: process.env.EMAIL_PASS,
  From: process.env.EMAIL_FROM,
  Secure: process.env.EMAIL_SECURE === "true",
};

module.exports = emailConfig;

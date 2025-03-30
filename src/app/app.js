const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const appConfig = require("./share/configs/app.conf");
const passport = require("./share/utils/passport.util");
const authConfig = require("./share/configs/auth.conf");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  session({
    secret: authConfig.Session.Secret,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./share/database/pg.database").connect();
require("./share/database/redis.database").connect();

// Passport Google OAuth
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/api/auth/profile");
  }
);

// Routes for all api
app.use("/api", require("./v1/routes"));

// Error handling Not found
app.use((_, __, next) => {
  const error = new Error("Not found");
  error.statusCode = 404;
  next(error);
});

// Error handling all errors
app.use((error, __, res, ____) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  const response = {
    message: message,
  };

  if (appConfig.NodeEnv === "development") {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
});

module.exports = app;

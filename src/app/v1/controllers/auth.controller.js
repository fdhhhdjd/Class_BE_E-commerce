const authService = require("../services/auth.service");

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body, res);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async loginGoogle(req, res) {
    try {
      const result = await authService.loginGoogle(req.body, res);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async logout(_, res) {
    try {
      const result = await authService.logout(res);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const result = await authService.forgotPassword(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async renewTokenByRefreshToken(req, res) {
    try {
      const result = await authService.renewTokenByRefreshToken(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
  // Passport
  LoginGooglePassport(req, res, next) {
    return authService.loginSocialPassport("google")(req, res, next);
  }

  logoutPassport(req, res, next) {
    try {
      const result = authService.logoutPassport(req, res, next);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  getProfilePassport(req, res) {
    try {
      const result = authService.getProfilePassport(req, res);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new AuthController();

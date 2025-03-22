const accountService = require("../services/account.service");

class AccountController {
  async getAccounts(_, res) {
    try {
      const result = await accountService.getAccounts();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async getAccount(req, res) {
    try {
      const result = await accountService.getAccountById(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async createAccount(req, res) {
    try {
      const result = await accountService.createAccount(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async updateAccount(req, res) {
    try {
      const result = await accountService.updateAccount(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async deleteAccount(req, res) {
    try {
      const result = await accountService.deleteAccount(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new AccountController();

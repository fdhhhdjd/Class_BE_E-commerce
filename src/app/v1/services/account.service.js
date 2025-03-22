const accountModel = require("../models/account.model");
const randomUtils = require("../../share/utils/random.util");
const PasswordUtils = require("../../share/utils/password.util");

class AccountService {
  async getAccounts() {
    return {
      message: "Accounts found",
      data: await accountModel.getAccounts(),
    };
  }

  async getAccountById(req) {
    const { id } = req.params;

    if (!id) {
      throw new Error("id must be provided");
    }

    const account = await accountModel.getAccountById(id);

    if (!account) {
      throw new Error("Account not found");
    }

    return {
      message: "Account found",
      data: account,
    };
  }

  async createAccount(req) {
    const { email, password, full_name, avatar_url, username } = req.body;

    if (!email || !password || !full_name) {
      throw new Error(
        "Required fields: email, password, and full_name must be provided."
      );
    }

    const finalAvatarUrl = avatar_url || randomUtils.getAvatar(full_name);

    const finalUsername = username || randomUtils.generateUsername(full_name);

    const hashedPassword = PasswordUtils.hash({ password });

    const accountData = {
      email,
      password: hashedPassword,
      full_name,
      avatar_url: avatar_url || finalAvatarUrl,
      username: username || finalUsername,
    };

    const newAccount = await accountModel.createAccount(accountData);

    return {
      message: "Account created successfully",
      data: newAccount,
    };
  }

  async updateAccount(req) {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      throw new Error("id must be provided");
    }

    const account = await accountModel.getAccountById(id);

    if (!account.length) {
      throw new Error("Account not found");
    }

    const updatedAccount = await accountModel.updateAccount(id, data);

    return {
      message: "Account updated successfully",
      data: updatedAccount,
    };
  }

  async deleteAccount(req) {
    const { id } = req.params;

    if (!id) {
      throw new Error("id must be provided");
    }

    const account = await accountModel.getAccountById(id);

    if (!account.length) {
      throw new Error("Account not found");
    }

    const result = await accountModel.deleteAccount(id);

    return {
      message: "Account deleted successfully",
      data: result,
    };
  }
}

module.exports = new AccountService();

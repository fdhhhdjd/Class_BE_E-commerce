const _ = require("lodash");
const authConstants = require("../constants/auth.constants");

class AuthValidate {
  static isEmailValid(email) {
    if (!_.isString(email)) {
      throw new Error("Invalid input: email is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  static isUsernameValid(username) {
    if (!_.isString(username)) {
      throw new Error("Invalid input: username is required.");
    }
    return username.length >= 8;
  }

  static checkTypeLogin(input) {
    if (this.isEmailValid(input)) {
      return authConstants.LoginType.Email;
    } else if (this.isUsernameValid(input)) {
      return authConstants.LoginType.Username;
    }
    return null;
  }
}

module.exports = AuthValidate;

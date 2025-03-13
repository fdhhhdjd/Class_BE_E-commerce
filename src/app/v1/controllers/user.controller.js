const userService = require("../services/user.service");

class UserController {
  async getUser(req, res) {
    try {
      const result = await userService.getUser(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      await userService.updateUser(req);
      return res.status(200).send({
        message: "User updated successfully",
      });
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new UserController();

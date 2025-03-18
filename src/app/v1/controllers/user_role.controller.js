const userRoleService = require("../services/user_role.service");
class UserRoleController {
  async assignRoleToUserHandler(req, res) {
    try {
      const result = await userRoleService.assignRoleToUser(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async getUserRolesHandler(req, res) {
    try {
      const result = await userRoleService.getUserRoles(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async removeRoleFromUserHandler(req, res) {
    try {
      const result = await userRoleService.removeRoleFromUser(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new UserRoleController();

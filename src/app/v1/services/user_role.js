const userRoleModel = require("../models/user_role.model");

class UserRoleService {
  async assignRoleToUser(req) {
    try {
      const { userId, roleId } = req.params;
      if (!userId || !roleId) {
        return "userId and roleId are required";
      }

      return await userRoleModel.assignRoleToUser(userId, roleId);
    } catch (error) {
      console.log("UserRoleService -> assignRoleToUser -> error", error);
    }
  }

  async getUserRoles(req) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return "userId is required";
      }

      return await userRoleModel.getUserRoles(userId);
    } catch (error) {
      console.log("UserRoleService -> getUserRoles -> error", error);
    }
  }

  async removeRoleFromUser(req) {
    try {
      const { userId, roleId } = req.body;
      if (!userId || !roleId) {
        return "userId and roleId are required";
      }

      return await userRoleModel.removeRoleFromUser(userId, roleId);
    } catch (error) {
      console.log("UserRoleService -> removeRoleFromUser -> error", error);
    }
  }
}

module.exports = new UserRoleService();

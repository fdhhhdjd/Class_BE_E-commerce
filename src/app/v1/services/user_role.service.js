const userRoleModel = require("../models/user_role.model");

class UserRoleService {
  async assignRoleToUser(req) {
    try {
      const { userId, roleId } = req.params;
      if (!userId || !roleId) {
        return "userId and roleId are required";
      }

      const result = await userRoleModel.assignRoleToUser(userId, roleId);
      return {
        message: "Role assigned to user successfully",
        data: result,
      };
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

      const result = await userRoleModel.getUserRoles(userId);
      return {
        message: "User roles found",
        data: result,
      };
    } catch (error) {
      console.log("UserRoleService -> getUserRoles -> error", error);
    }
  }

  async removeRoleFromUser(req) {
    try {
      const { userId, roleId } = req.params;
      if (!userId || !roleId) {
        return "userId and roleId are required";
      }
      const result = await userRoleModel.removeRoleFromUser(userId, roleId);
      return {
        message: "Role removed from user successfully",
        data: result,
      };
    } catch (error) {
      console.log("UserRoleService -> removeRoleFromUser -> error", error);
    }
  }
}

module.exports = new UserRoleService();

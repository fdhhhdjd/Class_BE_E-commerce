const rolePermissionModel = require("../models/role_permission.model");

class RolePermissionService {
  async assignPermissionToRole(req) {
    try {
      const { roleId, permissionId } = req.params;
      if (!roleId || !permissionId) {
        return "roleId and permissionId are required";
      }

      return await rolePermissionModel.assignPermissionToRole(
        roleId,
        permissionId
      );
    } catch (error) {
      console.log(
        "RolePermissionService -> assignPermissionToRole -> error",
        error
      );
    }
  }

  async getRolePermissions(req) {
    try {
      const { roleId } = req.params;
      if (!roleId) {
        return "roleId is required";
      }

      return await rolePermissionModel.getRolePermissions(roleId);
    } catch (error) {
      console.log(
        "RolePermissionService -> getRolePermissions -> error",
        error
      );
    }
  }

  async removePermissionFromRole(req) {
    try {
      const { roleId, permissionId } = req.body;
      if (!roleId || !permissionId) {
        return "roleId and permissionId are required";
      }

      return await rolePermissionModel.removePermissionFromRole(
        roleId,
        permissionId
      );
    } catch (error) {
      console.log(
        "RolePermissionService -> removePermissionFromRole -> error",
        error
      );
    }
  }
}

module.exports = new RolePermissionService();

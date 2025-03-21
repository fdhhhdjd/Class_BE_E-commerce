const rolePermissionModel = require("../models/role_permission.model");

class RolePermissionService {
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

  async assignPermissionToRoleBulk(req) {
    try {
      const { roleId } = req.params;
      const { permissionIds } = req.body;

      console.log(permissionIds);

      if (!roleId || !permissionIds) {
        return "roleId and permissionIds are required";
      }

      return await rolePermissionModel.softDeletePermissionsFromRoleBulk(
        roleId,
        permissionIds
      );
    } catch (error) {
      console.log(
        "RolePermissionService -> assignPermissionToRoleBulk -> error",
        error
      );
    }
  }

  async removePermissionFromRole(req) {
    try {
      const { roleId, permissionId } = req.params;
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

  async softDeletePermissionsFromRoleBulk(req) {
    try {
      const { roleId } = req.params;
      const { permissionIds } = req.body;

      if (!roleId || !permissionIds) {
        return "roleId and permissionIds are required";
      }

      return await rolePermissionModel.softDeletePermissionsFromRoleBulk(
        roleId,
        permissionIds
      );
    } catch (error) {
      console.log(
        "RolePermissionService -> softDeletePermissionsFromRoleBulk -> error",
        error
      );
    }
  }
}

module.exports = new RolePermissionService();

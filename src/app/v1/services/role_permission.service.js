const rolePermissionModel = require("../models/role_permission.model");

class RolePermissionService {
  async getRolePermissions(req) {
    try {
      const { roleId } = req.params;
      if (!roleId) {
        return "roleId is required";
      }
      const result = await rolePermissionModel.getRolePermissions(roleId);
      return {
        message: "Role permissions found",
        data: result,
      };
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
      const result = await rolePermissionModel.assignPermissionToRole(
        roleId,
        permissionId
      );
      return {
        message: "Permission assigned to role successfully",
        data: result,
      };
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

      if (!roleId || !permissionIds) {
        return "roleId and permissionIds are required";
      }
      const result =
        await rolePermissionModel.softDeletePermissionsFromRoleBulk(
          roleId,
          permissionIds
        );
      return {
        message: "Permissions assigned to role successfully",
        data: result,
      };
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

      const result = await rolePermissionModel.removePermissionFromRole(
        roleId,
        permissionId
      );
      return {
        message: "Permission removed from role successfully",
        data: result,
      };
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

      const result =
        await rolePermissionModel.softDeletePermissionsFromRoleBulk(
          roleId,
          permissionIds
        );

      return {
        message: "Permissions removed from role successfully",
        data: result,
      };
    } catch (error) {
      console.log(
        "RolePermissionService -> softDeletePermissionsFromRoleBulk -> error",
        error
      );
    }
  }
}

module.exports = new RolePermissionService();

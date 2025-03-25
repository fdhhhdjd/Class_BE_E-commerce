const rolePermissionService = require("../services/role_permission.service");

class RolePermissionController {
  async getRolePermissionsHandler(req, res) {
    try {
      const result = await rolePermissionService.getRolePermissions(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async assignPermissionToRoleHandler(req, res) {
    try {
      const result = await rolePermissionService.assignPermissionToRole(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async assignPermissionToRoleBulkHandler(req, res) {
    try {
      const result = await rolePermissionService.assignPermissionToRoleBulk(
        req
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async revokePermissionFromRoleHandler(req, res) {
    try {
      const result = await rolePermissionService.removePermissionFromRole(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async revokePermissionFromRoleBulkHandler(req, res) {
    try {
      const result =
        await rolePermissionService.softDeletePermissionsFromRoleBulk(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new RolePermissionController();

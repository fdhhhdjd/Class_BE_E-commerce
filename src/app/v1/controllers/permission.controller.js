const permissionService = require("../services/permission.service");

class PermissionController {
  async getPermissionsHandler(req, res) {
    try {
      const result = await permissionService.getPermissions(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async getPermissionHandler(req, res) {
    try {
      const result = await permissionService.getPermissionById(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async createPermissionHandler(req, res) {
    try {
      const result = await permissionService.createPermission(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async updatePermissionHandler(req, res) {
    try {
      const result = await permissionService.updatePermission(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async deletePermissionHandler(req, res) {
    try {
      const result = await permissionService.deletePermission(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new PermissionController();

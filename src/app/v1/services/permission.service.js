const permissionModel = require("../models/permission.model");

class PermissionService {
  async getPermissions() {
    return permissionModel.getPermissions();
  }

  async getPermissionById(req) {
    const { permissionId } = req.params;

    if (!permissionId) {
      throw new Error("Permission ID is required");
    }

    const permission = await permissionModel.permissionModel(permissionId);

    return permission;
  }

  async createPermission(req) {
    const { permissionName, description } = req.body;

    if (!permissionName || !description) {
      throw new Error("Permission name and description are required");
    }

    const permission = await permissionModel.createPermission(
      permissionName,
      description
    );

    return {
      message: "Permission created successfully",
      permission: permission.permission_name,
      description: permission.description,
    };
  }

  async updatePermission(req) {
    const { permissionId, permissionName, description } = req.body;

    if (!permissionId) {
      throw new Error("Permission ID is required");
    }

    const permission = await permissionModel.updatePermission(
      permissionId,
      permissionName,
      description
    );

    return {
      message: "Permission updated successfully",
      permission: permission.permission_name,
      description: permission.description,
    };
  }

  async deletePermission(req) {
    const { permissionId } = req.body;

    if (!permissionId) {
      throw new Error("Permission ID is required");
    }

    const permission = await permissionModel.deletePermission(permissionId);

    return {
      message: "Permission deleted successfully",
      permission: permission.permission_name,
      description: permission.description,
    };
  }
}

module.exports = new PermissionService();

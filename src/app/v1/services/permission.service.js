const permissionModel = require("../models/permission.model");

class PermissionService {
  async getPermissions() {
    return {
      message: "Permissions found",
      data: await permissionModel.getPermissions(),
    };
  }

  async getPermissionById(req) {
    const { permissionId } = req.params;

    if (!permissionId) {
      throw new Error("Permission ID is required");
    }

    const result = await permissionModel.permissionModel(permissionId);

    return {
      message: "Permission found",
      data: result,
    };
  }

  async createPermission(req) {
    const { permissionName, description } = req.body;

    if (!permissionName || !description) {
      throw new Error("Permission name and description are required");
    }

    const result = await permissionModel.createPermission(
      permissionName,
      description
    );

    return {
      message: "Permission created successfully",
      data: result,
    };
  }

  async updatePermission(req) {
    const { permissionId, permissionName, description } = req.body;

    if (!permissionId) {
      throw new Error("Permission ID is required");
    }

    const result = await permissionModel.updatePermission(
      permissionId,
      permissionName,
      description
    );

    return {
      message: "Permission updated successfully",
      data: result,
    };
  }

  async deletePermission(req) {
    const { permissionId } = req.body;

    if (!permissionId) {
      throw new Error("Permission ID is required");
    }

    const result = await permissionModel.deletePermission(permissionId);

    return {
      message: "Permission deleted successfully",
      data: result,
    };
  }
}

module.exports = new PermissionService();

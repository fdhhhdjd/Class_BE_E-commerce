const roleModel = require("../models/role.model");

class RoleService {
  async getRolesHandler() {
    const roles = roleModel.getRoles();
    return {
      message: "Roles found",
      data: roles,
    };
  }

  async getRoleHandler(req, res) {
    const { roleId } = req.params;
    if (!roleId) {
      throw new Error("Role ID is required");
    }

    const role = await roleModel.getRoleById(roleId);

    return {
      message: "Role found",
      data: role,
    };
  }

  async createRoleHandler(req) {
    const { roleName, description } = req.body;
    if (!roleName || !description) {
      throw new Error("Role name and description are required");
    }

    const role = await roleModel.createRole(roleName, description);

    return {
      message: "Role created successfully",
      data: role,
    };
  }

  async updateRoleHandler(req) {
    const { roleId, roleName, description } = req.body;
    if (!roleId) {
      throw new Error("Role ID are required");
    }

    const role = await roleModel.updateRole(roleId, roleName, description);

    return {
      message: "Role updated successfully",
      data: role,
    };
  }
  async deleteRoleHandler(req) {
    const { roleId } = req.body;
    if (!roleId) {
      throw new Error("Role ID is required");
    }

    const role = await roleModel.deleteRole(roleId);

    return {
      message: "Role deleted successfully",
      data: role,
    };
  }
}

module.exports = new RoleService();

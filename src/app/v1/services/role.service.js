const roleModel = require("../models/role.model");

class RoleService {
  async getRolesHandler() {
    return roleModel.getRoles();
  }

  async getRoleHandler(req, res) {
    const { roleId } = req.params;
    if (!roleId) {
      throw new Error("Role ID is required");
    }

    const role = await roleModel.getRoleById(roleId);

    return role;
  }

  async createRoleHandler(req) {
    const { roleName, description } = req.body;
    if (!roleName || !description) {
      throw new Error("Role name and description are required");
    }

    const role = await roleModel.createRole(roleName, description);

    return {
      message: "Role created successfully",
      role: role.role_name,
      description: role.description,
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
      role: role.role_name,
      description: role.description,
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
      role: role.role_name,
      description: role.description,
    };
  }
}

module.exports = new RoleService();

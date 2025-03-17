const roleService = require("../services/role.service");

class RoleController {
  async getRolesHandler(req, res) {
    try {
      const result = await roleService.getRolesHandler(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async getRoleHandler(req, res) {
    try {
      const result = await roleService.getRoleHandler(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async createRoleHandler(req, res) {
    try {
      const result = await roleService.createRoleHandler(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async updateRoleHandler(req, res) {
    try {
      const result = await roleService.updateRoleHandler(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async deleteRoleHandler(req, res) {
    try {
      const result = await roleService.deleteRoleHandler(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new RoleController();

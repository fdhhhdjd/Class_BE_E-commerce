const pgDatabase = require("../../share/database/pg.database");

class RoleModel {
  async createRole(roleName, description) {
    try {
      const query = `
    INSERT INTO roles (role_name, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
      const values = [roleName, description];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> createRole -> error", error);
    }
  }

  async getRoleById(roleId) {
    try {
      const query = "SELECT * FROM roles WHERE role_id = $1";
      const values = [roleId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> getRoleById -> error", error);
    }
  }
}

module.exports = new RoleModel();

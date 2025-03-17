const pgDatabase = require("../../share/database/pg.database");

class PermissionModel {
  async createPermission(permissionName, description) {
    try {
      const query = `
          INSERT INTO permissions (permission_name, description)
          VALUES ($1, $2)
          RETURNING *;
        `;
      const values = [permissionName, description];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> createPermission -> error", error);
    }
  }
  async PermissionModel(permissionId) {
    try {
      const query = "SELECT * FROM permissions WHERE permission_id = $1";
      const values = [permissionId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> permissionId -> error", error);
    }
  }
}

module.exports = new PermissionModel();

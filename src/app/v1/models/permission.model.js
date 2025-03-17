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
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> createPermission -> error", error);
    }
  }
  async permissionModel(permissionId) {
    try {
      const query =
        "SELECT * FROM permissions WHERE permission_id = $1 AND is_deleted = FALSE";
      const values = [permissionId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0] || {};
    } catch (error) {
      console.log("UserModel -> permissionId -> error", error);
    }
  }
  async getPermissions() {
    try {
      const query = "SELECT * FROM permissions WHERE is_deleted = FALSE";
      const { rows } = await pgDatabase.query(query);
      return rows;
    } catch (error) {
      console.log("UserModel -> getPermissions -> error", error);
    }
  }

  async updatePermission(permissionId, permissionName, description) {
    try {
      const query = `
          UPDATE permissions
          SET 
            permission_name = COALESCE($2, permission_name), 
            description = COALESCE($3, description)
          WHERE permission_id = $1 AND is_deleted = FALSE
          RETURNING *;
        `;
      const values = [permissionId, permissionName, description];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> updatePermission -> error", error);
    }
  }

  async deletePermission(permissionId) {
    try {
      const query = `
          UPDATE permissions
          SET is_deleted = TRUE
          WHERE permission_id = $1 AND is_deleted = FALSE
          RETURNING *;
        `;

      const values = [permissionId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> deletePermission -> error", error);
    }
  }
}

module.exports = new PermissionModel();

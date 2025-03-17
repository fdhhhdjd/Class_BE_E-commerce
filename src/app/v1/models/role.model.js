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
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> createRole -> error", error);
    }
  }

  async getRoleById(roleId) {
    try {
      const query =
        "SELECT * FROM roles WHERE role_id = $1 AND is_deleted = FALSE";
      const values = [roleId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0] || {};
    } catch (error) {
      console.log("UserModel -> getRoleById -> error", error);
    }
  }

  async getRoles() {
    try {
      const query = "SELECT * FROM roles WHERE is_deleted = FALSE";
      const { rows } = await pgDatabase.query(query);
      return rows;
    } catch (error) {
      console.log("UserModel -> getRoles -> error", error);
    }
  }

  async updateRole(roleId, roleName, description) {
    try {
      const query = `
        UPDATE roles
        SET 
          role_name = COALESCE($2, role_name), 
          description = COALESCE($3, description)
        WHERE role_id = $1 AND is_deleted = FALSE
        RETURNING *;
      `;
      const values = [roleId, roleName, description];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> updateRole -> error", error);
    }
  }

  async deleteRole(roleId) {
    try {
      const query = `
        UPDATE roles
        SET is_deleted = TRUE
        WHERE role_id = $1 AND is_deleted = FALSE
        RETURNING *;
      `;
      const values = [roleId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> deleteRole -> error", error);
    }
  }
}

module.exports = new RoleModel();

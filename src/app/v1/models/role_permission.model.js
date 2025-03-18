const pgDatabase = require("../../share/database/pg.database");

class RolePermissionModel {
  async assignPermissionToRole(roleId, permissionId) {
    try {
      const query = `
                INSERT INTO role_permissions (role_id, permission_id)
                VALUES ($1, $2)
                RETURNING *;
            `;
      const values = [roleId, permissionId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log(
        "RolePermissionModel -> assignPermissionToRole -> error",
        error
      );
    }
  }

  async getRolePermissions(roleId) {
    try {
      const query = `
                    SELECT p.*
                    FROM role_permissions rp
                    JOIN permissions p ON rp.permission_id = p.permission_id
                    WHERE rp.role_id = $1;
                `;
      const values = [roleId];
      const { rows } = await pgDatabase.query(query, values);
      return rows;
    } catch (error) {
      console.log("RolePermissionModel -> getRolePermissions -> error", error);
    }
  }

  async removePermissionFromRole(roleId, permissionId) {
    try {
      const query = `
                    DELETE FROM role_permissions
                    WHERE role_id = $1 AND permission_id = $2
                    RETURNING *;
                `;
      const values = [roleId, permissionId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log(
        "RolePermissionModel -> removePermissionFromRole -> error",
        error
      );
    }
  }

  async getUserPermissions(userId) {
    try {
      const query = `
        SELECT p.permission_name 
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.permission_id
        JOIN user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.user_id = $1 AND p.is_deleted = FALSE
      `;
      const values = [userId];
      const { rows } = await pgDatabase.query(query, values);
      return rows.map((row) => row.permission_name);
    } catch (error) {
      console.log("RolePermissionModel -> getUserPermissions -> error", error);
    }
  }
}

module.exports = new RolePermissionModel();

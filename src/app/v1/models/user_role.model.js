class UserRoleModel {
  async assignRoleToUser(userId, roleId) {
    try {
      const query = `
                INSERT INTO user_roles (user_id, role_id)
                VALUES ($1, $2)
                RETURNING *;
            `;
      const values = [userId, roleId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserRoleModel -> assignRoleToUser -> error", error);
    }
  }

  async getUserRoles(userId) {
    try {
      const query = `
                        SELECT r.*
                        FROM user_roles ur
                        JOIN roles r ON ur.role_id = r.role_id
                        WHERE ur.user_id = $1;
                    `;
      const values = [userId];
      const { rows } = await pgDatabase.query(query, values);
      return rows;
    } catch (error) {
      console.log("UserRoleModel -> getUserRoles -> error", error);
    }
  }

  async removeRoleFromUser(userId, roleId) {
    try {
      const query = `
                        DELETE FROM user_roles
                        WHERE user_id = $1 AND role_id = $2
                        RETURNING *;
                    `;
      const values = [userId, roleId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserRoleModel -> removeRoleFromUser -> error", error);
    }
  }
}

module.exports = new UserRoleModel();

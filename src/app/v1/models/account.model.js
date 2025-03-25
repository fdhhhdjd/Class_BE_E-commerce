const pgDatabase = require("../../share/database/pg.database");

class AccountModel {
  async getAccounts() {
    try {
      const query = `
        SELECT 
          u.user_id, 
          u.username, 
          u.email, 
          u.full_name,
          u.avatar_url,
          u.phone_number,
          u.address,
          u.is_blocked,
          u.last_login,
          r.role_id, 
          r.role_name
        FROM users u
        JOIN user_roles ur ON u.user_id = ur.user_id
        JOIN roles r ON ur.role_id = r.role_id
        WHERE u.is_deleted = FALSE 
          AND u.is_blocked = FALSE
          AND r.role_name != 'user'
      `;

      const { rows } = await pgDatabase.query(query);

      const accounts = rows.map((row) => ({
        user_id: row.user_id,
        username: row.username,
        email: row.email,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
        phone_number: row.phone_number,
        address: row.address,
        is_blocked: row.is_blocked,
        last_login: row.last_login,
        role: {
          role_id: row.role_id,
          role_name: row.role_name,
        },
      }));

      return { users: accounts };
    } catch (error) {
      console.error("AccountModel -> getAccounts -> error", error);
      throw error;
    }
  }

  async getAccountById(id) {
    try {
      const query = `
        SELECT 
          u.user_id, 
          u.username, 
          u.email, 
          r.role_id, 
          r.role_name, 
          p.permission_id, 
          p.permission_name
        FROM users u
        JOIN user_roles ur ON u.user_id = ur.user_id
        JOIN roles r ON ur.role_id = r.role_id
        LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.permission_id
        WHERE u.user_id = $1 
          AND u.is_deleted = FALSE 
          AND u.is_blocked = FALSE
          AND r.role_name != 'user'
      `;

      const values = [id];
      const { rows } = await pgDatabase.query(query, values);

      if (rows.length === 0) return null;

      const userData = {
        user_id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
        role: {
          role_id: rows[0].role_id,
          role_name: rows[0].role_name,
        },
        permissions: [],
      };

      // Thêm các quyền vào mảng permissions
      rows.forEach((row) => {
        if (row.permission_id) {
          userData.permissions.push({
            permission_id: row.permission_id,
            permission_name: row.permission_name,
          });
        }
      });

      return { user: userData };
    } catch (error) {
      console.error("AccountModel -> getAccountById -> error", error);
      throw error;
    }
  }

  async createAccount({
    email,
    full_name,
    password,
    username = null,
    avatar_url = null,
    phone_number = null,
    address = null,
  }) {
    try {
      const checkQuery = `
        SELECT * FROM users 
        WHERE email = $1 OR username = $2
      `;
      const checkValues = [email, username];
      const { rows: existingUsers } = await pgDatabase.query(
        checkQuery,
        checkValues
      );

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        if (existingUser.email === email) {
          throw new Error("Email already exists. Cannot create account.");
        }
        if (existingUser.username === username) {
          throw new Error("Username already exists. Cannot create account.");
        }
      }

      const query = `
        INSERT INTO users (email, full_name, password, username, avatar_url, phone_number, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [
        email,
        full_name,
        password,
        username,
        avatar_url,
        phone_number,
        address,
      ];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("AccountModel -> createAccount -> error", error);
      throw error;
    }
  }

  async updateAccount(id, data) {
    try {
      if (data.email || data.username) {
        const checkQuery = `
          SELECT * FROM users 
          WHERE (email = $1 OR username = $2) AND user_id != $3 AND is_deleted = FALSE
        `;
        const checkValues = [data.email || null, data.username || null, id];
        const { rows: existingUsers } = await pgDatabase.query(
          checkQuery,
          checkValues
        );

        if (existingUsers.length > 0) {
          const existingUser = existingUsers[0];
          if (existingUser.email === data.email) {
            throw new Error("Email already exists. Cannot update account.");
          }
          if (existingUser.username === data.username) {
            throw new Error("Username already exists. Cannot update account.");
          }
        }
      }

      const query = `
        UPDATE users
        SET
          username = COALESCE($1, username),
          email = COALESCE($2, email),
          avatar_url = COALESCE($3, avatar_url),
          full_name = COALESCE($4, full_name),
          phone_number = COALESCE($5, phone_number),
          address = COALESCE($6, address)
        WHERE user_id = $7 AND is_blocked = FALSE AND is_deleted = FALSE
        RETURNING *;
      `;
      const values = [
        data.username || null,
        data.email || null,
        data.avatar_url || null,
        data.full_name || null,
        data.phone_number || null,
        data.address || null,
        id,
      ];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("AccountModel -> updateAccount -> error", error);
      throw error;
    }
  }

  async deleteAccount(id) {
    try {
      const query = `
        UPDATE users
        SET is_deleted = TRUE
        WHERE user_id = $1 AND is_deleted = FALSE
        RETURNING *;
      `;
      const values = [id];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("AccountModel -> deleteAccount -> error", error);
      throw error;
    }
  }
}

module.exports = new AccountModel();

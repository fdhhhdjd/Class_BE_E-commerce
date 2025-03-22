const pgDatabase = require("../../share/database/pg.database");

class AccountModel {
  async getAccounts() {
    try {
      const query =
        "SELECT * FROM users WHERE is_deleted = FALSE AND is_blocked = FALSE";
      const { rows } = await pgDatabase.query(query);
      return rows;
    } catch (error) {
      console.log("AccountModel -> getAccounts -> error", error);
      throw error;
    }
  }

  async getAccountById(id) {
    try {
      const query =
        "SELECT * FROM users WHERE user_id = $1 AND is_deleted = FALSE AND is_blocked = FALSE";
      const values = [id];
      const { rows } = await pgDatabase.query(query, values);
      return rows || {};
    } catch (error) {
      console.log("AccountModel -> getAccountById -> error", error);
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

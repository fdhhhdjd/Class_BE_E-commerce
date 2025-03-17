const pgDatabase = require("../../share/database/pg.database");

class UserModel {
  async create({ email, password }) {
    try {
      const query =
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
      const values = [email, password];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> create -> error", error);
    }
  }

  async getUser({ user_id }) {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const values = [user_id];

    const { rows } = await pgDatabase.query(query, values);

    return rows[0];
  }

  async findOneByEmail({ email }) {
    try {
      const query =
        "SELECT * FROM users WHERE email = $1 AND is_deleted = false";
      const values = [email];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> findOneByEmail -> error", error);
    }
  }

  async findOneByUsername({ username }) {
    try {
      const query =
        "SELECT * FROM users WHERE username = $1 AND is_deleted = false";
      const values = [username];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> findOneByUsername -> error", error);
    }
  }

  async updatePassword({ user_id, password }) {
    try {
      const query = "UPDATE users SET password = $1 WHERE user_id = $2";
      const values = [password, user_id];
      await pgDatabase.query(query, values);
    } catch (error) {
      console.log("UserModel -> updatePassword -> error", error);
    }
  }

  async updateUser({ user_id, username, fullname, avatar_url }) {
    try {
      const query = `
        UPDATE users
        SET 
          username = COALESCE($1, username),
          fullname = COALESCE($2, fullname),
          avatar_url = COALESCE($3, avatar_url)
        WHERE user_id = $4
      `;
      const values = [username, fullname, avatar_url, user_id];
      await pgDatabase.query(query, values);
    } catch (error) {
      console.log("UserModel -> updateUser -> error", error);
      throw error;
    }
  }
}

module.exports = new UserModel();

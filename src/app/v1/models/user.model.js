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
    try {
      const query = `
        SELECT u.*, r.role_id, r.role_name
        FROM users u
        LEFT JOIN user_roles ur ON u.user_id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.role_id
        WHERE u.user_id = $1 AND u.is_deleted = false
      `;
      const values = [user_id];

      const { rows } = await pgDatabase.query(query, values);

      return rows[0];
    } catch (error) {
      console.log("UserModel -> getUser -> error", error);
      return null;
    }
  }

  async findOneByEmail({ email }) {
    try {
      const query = `
      SELECT u.*, r.role_id, r.role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      WHERE u.email = $1 AND u.is_deleted = false
    `;
      const values = [email];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> findOneByEmail -> error", error);
    }
  }

  async findOneByUsername({ username }) {
    try {
      const query = `
        SELECT u.*, r.role_id, r.role_name
        FROM users u
        LEFT JOIN user_roles ur ON u.user_id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.role_id
        WHERE u.username = $1 AND u.is_deleted = false
      `;
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

  async updateUser({ user_id, ...data }) {
    try {
      // Lọc ra các cặp key-value hợp lệ (loại bỏ undefined/null)
      const fields = Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null
      );

      if (fields.length === 0) return; // Không có gì để update

      // Tạo các đoạn field = COALESCE($1, field)
      const setClause = fields
        .map(([key], idx) => `${key} = COALESCE($${idx + 1}, ${key})`)
        .join(", ");

      // Giá trị tương ứng
      const values = fields.map(([_, value]) => value);
      values.push(user_id); // Cuối cùng là user_id

      const query = `
        UPDATE users
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $${values.length}
      `;

      await pgDatabase.query(query, values);
    } catch (error) {
      console.log("UserModel -> updateUser -> error", error);
      throw error;
    }
  }
}

module.exports = new UserModel();

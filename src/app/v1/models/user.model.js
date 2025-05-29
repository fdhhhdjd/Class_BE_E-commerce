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

  async newCreate({ email, password, is_active }) {
    try {
      const query =
        "INSERT INTO users (email, password, is_active) VALUES ($1, $2, $3) RETURNING *";
      const values = [email, password, is_active];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> create -> error", error);
    }
  }

  async getRoleWithPermissionsByUserId(user_id) {
    const query = `
      SELECT 
        r.role_id, 
        r.role_name,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
          'permission_id', p.permission_id,
          'permission_name', p.permission_name,
          'description', p.description
        )) FILTER (WHERE p.permission_id IS NOT NULL), '[]') AS permissions
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.role_id
      LEFT JOIN role_permissions rp ON r.role_id = rp.role_id AND rp.is_deleted = false
      LEFT JOIN permissions p ON rp.permission_id = p.permission_id AND p.is_deleted = false
      WHERE ur.user_id = $1
      GROUP BY r.role_id
    `;
    const { rows } = await pgDatabase.query(query, [user_id]);
    return rows[0];
  }

  async getUser({ user_id }) {
    try {
      const query = `
        SELECT * FROM users WHERE user_id = $1 AND is_deleted = false
      `;
      const values = [user_id];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> getUserBasic -> error", error);
      return null;
    }
  }

  async findOneByEmailNotIsActive({ email }) {
    try {
      const query = `
        SELECT * FROM users WHERE email = $1 AND is_deleted = false AND is_active = false
      `;
      const values = [email];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.log("UserModel -> findOneByEmailNotIsActive -> error", error);
    }
  }

  async findOneByEmail({ email }) {
    try {
      const query = `
      SELECT u.*, r.role_id, r.role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      WHERE u.email = $1 AND u.is_deleted = false AND u.is_active = true
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
        WHERE u.username = $1 AND u.is_deleted = false AND u.is_active = true
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

const pgDatabase = require("../../share/database/pg.database");

class EmailVerificationTokenModel {
  async getTokenByUserId({ userId, token }) {
    try {
      const query = `
                SELECT * FROM email_verification_tokens
                WHERE user_id = $1 AND token = $2 AND used = false
                LIMIT 1;
            `;
      const values = [userId, token];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error(
        "EmailVerificationTokenModel -> getTokenByUserId -> error",
        error
      );
      throw error;
    }
  }

  async createToken({ userId, token, expiresAt }) {
    try {
      const query = `
                INSERT INTO email_verification_tokens (user_id, token, expires_at)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
      const values = [userId, token, expiresAt];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error(
        "EmailVerificationTokenModel -> createToken -> error",
        error
      );
      throw error;
    }
  }

  async updateToken({ used, token }) {
    try {
      const query = `
                UPDATE email_verification_tokens
                SET used = $1
                WHERE token = $2
                RETURNING *;
            `;
      const values = [used, token];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error(
        "EmailVerificationTokenModel -> updateToken -> error",
        error
      );
      throw error;
    }
  }
}

module.exports = new EmailVerificationTokenModel();

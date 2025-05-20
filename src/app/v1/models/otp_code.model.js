const pgDatabase = require("../../share/database/pg.database");

class OTPCodeModel {
  async createOTPCode(userId, otpCode) {
    try {
      const query = `
            INSERT INTO otp_codes (user_id, otp_code)
            VALUES ($1, $2)
            RETURNING *
        `;
      const values = [userId, otpCode];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("OTPCodeModel -> createOTPCode -> error", error);
      throw error;
    }
  }

  async getOTPCodeByUserId(userId) {
    try {
      const query = `
            SELECT * FROM otp_codes
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1
        `;
      const values = [userId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("OTPCodeModel -> getOTPCodeByUserId -> error", error);
      throw error;
    }
  }

  async getOTPCode(userId, otpCode) {
    try {
      const query = `
            SELECT * FROM otp_codes
            WHERE user_id = $1 AND otp_code = $2
            ORDER BY created_at DESC
            LIMIT 1
        `;
      const values = [userId, otpCode];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("OTPCodeModel -> getOTPCode -> error", error);
      throw error;
    }
  }

  async updateIsUsed(userId, otpCode) {
    try {
      const query = `
            UPDATE otp_codes
            SET is_used = true
            WHERE user_id = $1 AND otp_code = $2
            RETURNING *
        `;
      const values = [userId, otpCode];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("OTPCodeModel -> updateIsUsed -> error", error);
      throw error;
    }
  }

  async deleteOTPCodeByUserId(userId) {
    try {
      const query = `
            DELETE FROM otp_codes
            WHERE user_id = $1
            RETURNING *
        `;
      const values = [userId];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("OTPCodeModel -> deleteOTPCodeByUserId -> error", error);
      throw error;
    }
  }
}

module.exports = new OTPCodeModel();

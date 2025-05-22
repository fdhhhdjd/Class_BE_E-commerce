const pgDatabase = require("../../share/database/pg.database");

class OTPCodeModel {
  async createOTPCode(userId, otpCode, expiresAt) {
    try {
      const query = `
        INSERT INTO otp_codes (user_id, otp_code, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [userId, otpCode, expiresAt];
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

  async isOTPCodeExpired(userId, otpCode) {
    try {
      const query = `
        SELECT expires_at
        FROM otp_codes
        WHERE user_id = $1 AND otp_code = $2 AND is_used = false
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const values = [userId, otpCode];
      const { rows } = await pgDatabase.query(query, values);

      if (rows.length === 0) {
        throw new Error("OTP code not found");
      }

      const { expires_at } = rows[0];
      const currentTime = new Date();

      // Check if the current time is past the expiration time
      if (currentTime > new Date(expires_at)) {
        return true; // OTP has expired
      }

      return false;
    } catch (error) {
      console.error("OTPCodeModel -> isOTPCodeExpired -> error", error);
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

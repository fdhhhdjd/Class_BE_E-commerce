const pgDatabase = require("../../share/database/pg.database");

class DeviceModel {
  static async upsertDevice(userId, deviceToken, data) {
    const query = `
      INSERT INTO device (user_id, device_token, platform, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, device_token)
      DO UPDATE SET
        platform = EXCLUDED.platform,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [userId, deviceToken, data.platform, data.is_active ?? true];

    try {
      const result = await pgDatabase.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in upsertDevice:", error);
      throw error;
    }
  }

  static async getUserDevices(userId) {
    const query = `
      SELECT device_token FROM device
      WHERE user_id = $1 AND is_active = true
    `;

    const values = [userId];

    try {
      const result = await pgDatabase.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error in getUserDevices:", error);
      throw error;
    }
  }
}

module.exports = DeviceModel;

const pgDatabase = require("../../share/database/pg.database");

class CustomerModel {
  async getCustomers() {
    try {
      const query = `
  SELECT u.*
  FROM users u
  JOIN user_roles ur ON u.user_id = ur.user_id
  JOIN roles r ON ur.role_id = r.role_id
  WHERE u.is_deleted = FALSE 
    AND u.is_blocked = FALSE 
    AND r.role_name = 'customer';
`;
      const { rows } = await pgDatabase.query(query);
      return rows;
    } catch (error) {
      console.log("CustomerModel -> getCustomer -> error", error);
      throw error;
    }
  }

  async getCustomerById(id) {
    try {
      const query = `
        SELECT u.*
        FROM users u
        JOIN user_roles ur ON u.user_id = ur.user_id
        JOIN roles r ON ur.role_id = r.role_id
        WHERE u.user_id = $1 
          AND u.is_deleted = FALSE 
          AND u.is_blocked = FALSE 
          AND r.role_name = 'customer';
      `;
      const values = [id];
      const { rows } = await pgDatabase.query(query, values);
      return rows[0] || {};
    } catch (error) {
      console.log("CustomerModel -> getCustomerById -> error", error);
      throw error;
    }
  }
}

module.exports = new CustomerModel();

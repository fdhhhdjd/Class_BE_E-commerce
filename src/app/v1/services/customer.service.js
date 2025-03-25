const customerModel = require("../models/customer.model");

class CustomerService {
  async getCustomers() {
    try {
      const customers = await customerModel.getCustomers();
      return customers;
    } catch (error) {
      console.log("CustomerService -> getCustomers -> error", error);
      throw error;
    }
  }

  async getCustomerById(req) {
    try {
      const { id } = req.params;
      const customer = await customerModel.getCustomerById(id);
      return customer;
    } catch (error) {
      console.log("CustomerService -> getCustomerById -> error", error);
      throw error;
    }
  }
}

module.exports = new CustomerService();

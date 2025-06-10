const DeviceModel = require("../models/device.model");

class DeviceService {
  async upsertDevice(userId, deviceToken, data) {
    const device = await DeviceModel.upsertDevice(userId, deviceToken, data);
    return device;
  }
}

module.exports = new DeviceService();

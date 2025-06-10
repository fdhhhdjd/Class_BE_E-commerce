const DeviceModel = require("../models/device.model");
const NotificationService = require("../services/notification.service");

class NotificationController {
  async sendUserDevice(req, res) {
    const { notification, data, deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).send({
        message: "Device ID is required",
      });
    }

    const message = {
      notification, // Tiêu đề và nội dung thông báo
      data, // Dữ liệu bổ sung (nếu có)
    };

    try {
      const result = await NotificationService.sendNotification(
        deviceId,
        message
      );
      return res.status(200).json({
        result: result,
      });
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async sendUserAllDevices(req, res) {
    const { notification, data, userId } = req.body;

    const devices = await DeviceModel.getUserDevices(userId);
    if (!devices || devices.length === 0) {
      return res.status(404).send({
        message: "No active devices found for the user",
      });
    }

    const deviceIds = devices.map((device) => device.device_token);
    const message = {
      notification, // Tiêu đề và nội dung thông báo
      data, // Dữ liệu bổ sung (nếu có)
    };

    const result = await NotificationService.sendNotificationToMultipleDevices(
      deviceIds,
      message
    );
    try {
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new NotificationController();

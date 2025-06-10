const firebaseCloud = require("../../share/database/firebase.cloud");

class NotificationService {
  async sendNotification(deviceId, { notification, data }) {
    const response = await firebaseCloud.sendNotification(deviceId, {
      notification,
      data,
    });
    return response;
  }

  async sendNotificationToMultipleDevices(deviceIds, { notification, data }) {
    const message = {
      notification,
      data,
    };

    const response = await firebaseCloud.sendNotificationToMultipleDevices(
      deviceIds,
      message
    );

    return response;
  }
}

module.exports = new NotificationService();

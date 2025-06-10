const admin = require("firebase-admin");
const serviceAccount = require("../../../../serviceAccountKey.json");

class FirebaseCloud {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.messaging = admin.messaging();
  }

  async testConnection() {
    try {
      const response = await this.messaging.send({
        notification: {
          title: "Test FCM",
          body: "Kết nối thành công!",
        },
        token: "dummy_token", // token giả để test kết nối
      });

      console.log("FCM response:", response);
    } catch (error) {
      if (error.code === "messaging/invalid-argument") {
        console.log(
          "✅ Kết nối Firebase thành công (token không hợp lệ nhưng đã kết nối)."
        );
      } else {
        console.error("❌ Lỗi khi kết nối Firebase:", error);
      }
    }
  }

  async sendNotification(deviceId, { notification, data }) {
    const message = {
      token: deviceId,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        ...data,
      },
    };

    try {
      const response = await this.messaging.send(message);
      console.log("Notification sent successfully:", response);
      return response;
    } catch (error) {
      if (
        error.errorInfo &&
        error.errorInfo.code === "messaging/registration-token-not-registered"
      ) {
        console.warn(
          `Token expired or invalid: ${deviceToken}. Skipping this token.`
        );
        // Xử lý logic xóa token khỏi cơ sở dữ liệu (nếu cần)
        // Ví dụ: await TokenService.removeInvalidToken(deviceToken);
      } else {
        console.error("Error sending message:", error);
      }
      throw error;
    }
  }

  async sendNotificationToMultipleDevices(deviceIds, { notification, data }) {
    const messages = {
      tokens: deviceIds,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        ...data,
      },
    };

    try {
      const response = await this.messaging.sendEachForMulticast(messages);
      console.log("Notifications sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending messages:", error);
      throw error;
    }
  }
}

module.exports = new FirebaseCloud();

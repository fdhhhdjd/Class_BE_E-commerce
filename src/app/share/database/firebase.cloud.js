const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require("../../../../serviceAccountKey.json");

class FirebaseService {
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
}

module.exports = new FirebaseService();

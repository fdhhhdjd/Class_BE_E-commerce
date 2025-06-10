class HeaderMiddleware {
  static getDeviceId(req, res, next) {
    const deviceId = req.headers["device_id"];

    if (!deviceId) {
      return res.status(400).json({ message: "Device_Id header is required" });
    }

    req.deviceId = deviceId; // Gắn `deviceId` vào request để sử dụng sau
    next();
  }
}

module.exports = HeaderMiddleware;

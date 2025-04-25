const userModel = require("../models/user.model");
const redisDB = require("../../share/database/redis.database");
class UserService {
  async getUser(req) {
    const { userId } = req.infoUserByToken;

    // 1. Get Cache
    let user = await redisDB.executeCommand("hgetall", `user:${userId}`);

    // Convert flat Redis hash (string values) to object
    if (user && Object.keys(user).length > 0) {
      // Redis returns all values as strings, convert appropriately if needed
      Object.keys(user).forEach((key) => {
        if (user[key] === "true") user[key] = true;
        else if (user[key] === "false") user[key] = false;
      });
    } else {
      // 2. Cache Miss → DB
      user = await userModel.getUser({ user_id: userId });

      if (!user) throw new Error("User not found");

      const flatUser = Object.entries(user).flat();
      await redisDB.executeCommand("hmset", `user:${userId}`, ...flatUser);
    }

    // 3. Always get role & permissions from DB
    const role = await userModel.getRoleWithPermissionsByUserId(userId);

    // 4. Return full response
    return {
      user: { ...user, role },
      message: "User found successfully",
    };
  }

  async updateUser(req) {
    // B1. Get data from body
    const data = req.body;

    // B2. Get userId from token
    const { userId } = req.infoUserByToken;

    // B3. Check user existence
    const user = await userModel.getUser({ user_id: userId });
    if (!user) throw new Error("User not found");

    // B4. Update database (chỉ cập nhật các trường có trong data)
    await userModel.updateUser({ user_id: userId, ...data });

    // B5. Lấy lại dữ liệu mới sau update
    const updatedUser = await userModel.getUser({ user_id: userId });

    // B6. Update Redis cache
    const flatUser = Object.entries(updatedUser).flat();
    await redisDB.executeCommand("hset", `user:${userId}`, ...flatUser);
  }
}

module.exports = new UserService();

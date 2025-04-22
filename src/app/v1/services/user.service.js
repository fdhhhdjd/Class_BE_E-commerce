const userModel = require("../models/user.model");
const redisDB = require("../../share/database/redis.database");
class UserService {
  async getUser(req) {
    const { userId } = req.infoUserByToken;

    // Get Cache from Redis (Cache Hit)
    let user = await redisDB.executeCommand("hgetall", `user:${userId}`);

    // If cache miss then get data from database
    if (!user || Object.keys(user).length === 0) {
      user = await userModel.getUser({ user_id: userId });

      // Set Cache to Redis
      const flatUser = Object.entries(user).flat();
      await redisDB.executeCommand("hmset", `user:${userId}`, ...flatUser);
    }

    // const user = await userModel.getUser({ id: userId });
    return {
      user: user ? user : [],
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

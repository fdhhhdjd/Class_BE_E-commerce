const userModel = require("../models/user.model");
const redisDB = require("../../share/database/redis.database");
class UserService {
  async getUser(req) {
    const { userId } = req.infoUserByToken;

    // Get Cache from Redis (Cache Hit)
    let user = await redisDB.executeCommand("hgetall", `user:${userId}`);

    // If cache miss then get data from database
    if (!user || Object.keys(user).length === 0) {
      user = await userModel.getUser({ id: userId });

      // Set Cache to Redis
      await redisDB.executeCommand("hmset", `user:${userId}`, user);
    }

    // const user = await userModel.getUser({ id: userId });
    return {
      user: user ? user : [],
      message: "User found successfully",
    };
  }

  async updateUser(req) {
    // B1. Get data from body
    const { username, fullname, avatar_url } = req.body;

    // B2. Get userId from token
    const { userId } = req.infoUserByToken;

    // B3. Get userId from token
    const user = await userModel.getUser({ id: userId });

    // B4. Check user exist
    if (!user) {
      throw new Error("User not found");
    }

    if (username) {
      user.username = username;
    }
    if (fullname) {
      user.fullname = fullname;
    }
    if (avatar_url) {
      user.avatar_url = avatar_url;
    }

    // Update database
    await userModel.updateUser({
      id: userId,
      username: user.username,
      fullname: user.fullname,
      avatar_url: user.avatar_url,
    });

    // Update cache
    await redisDB.executeCommand("hmset", `user:${userId}`, user);
  }
}

module.exports = new UserService();

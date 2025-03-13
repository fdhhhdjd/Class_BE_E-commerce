const Redis = require("ioredis");
const redisConfig = require("../configs/redis.conf");

class RedisDatabase {
  constructor() {
    // Create a Redis client
    this.client = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    });
  }

  // Connect to the Redis database
  async connect() {
    // Handle connection events
    this.client.on("connect", () => {
      console.log("Connected to Redis 🚀");
    });

    this.client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    this.client.on("close", () => {
      console.log("Redis connection closed");
    });
  }

  // Execute a Redis command
  async executeCommand(command, ...args) {
    try {
      const result = await this.client[command](...args);
      return result;
    } catch (err) {
      console.error(`Error executing Redis command "${command}":`, err);
      throw err;
    }
  }

  // Close the Redis connection
  async disconnect() {
    try {
      await this.client.quit();
      console.log("Redis connection closed gracefully");
    } catch (err) {
      console.error("Error closing Redis connection:", err);
      throw err;
    }
  }
}

// Singleton instance of RedisDatabase
const redisDB = new RedisDatabase();

module.exports = redisDB;

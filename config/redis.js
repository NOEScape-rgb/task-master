const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

// config/redis.js
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis Connected");
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error.message);
  }
};


module.exports = { redisClient, connectRedis };
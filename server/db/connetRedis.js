import { createClient } from "redis";

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient();
    await redisClient.connect();
  } catch (err) {
    console.log("REDIS CONNECTION ERROR", err);
  }
};

const getRedisClient = async () => {
  if (!redisClient) {
    try {
      redisClient = createClient();
      await redisClient.connect();
      return redisClient;
    } catch (error) {
      console.log("ERROR WHILE RECONNECTING REDIS", error);
    }
  }
  return redisClient;
};

export { connectRedis, getRedisClient };

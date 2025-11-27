/* eslint-disable no-undef */
import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://:mypassword@localhost:6379"
});

client.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  try {
    await client.connect(); // important: wait until connected
    console.log("Redis connected!");
  } catch (err) {
    console.error("Redis connection error:", err);
    process.exit(1); // exit if Redis is required
  }
};

export default client;

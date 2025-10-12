import { Redis } from "ioredis";

export const redis = new Redis({
  host: "localhost",
  port: 6379,
  //password: "your_redis_password", // Substitua pela sua senha do Redis,
});
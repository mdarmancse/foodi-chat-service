import { createClient } from "redis";

const url = process.env.REDIS_URL || "";

export const redis = createClient({ url });

export async function initRedis() {
  redis.on("error", (err: Error) => console.log(`Redis error: ${err}`));
  await redis.connect();
  console.log(`Connected to redis at ${url}`);
}

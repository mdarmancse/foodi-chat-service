import { redis } from "storage";
import { PartitionCount } from "../constants";

export async function clearOnlineUsers() {
  const queues: string[] = [];
  for (let i = 0; i < PartitionCount; i++) {
    queues.push(`chat:online-users:${i}`);
  }
  redis.DEL(queues);
}

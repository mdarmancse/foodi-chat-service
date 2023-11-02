import { hashUserId } from "./hashUserId";

export function getOnlineUsersQueueName(id: string | number) {
  const hash = hashUserId(id);
  return `chat:online-users:${hash}`;
}

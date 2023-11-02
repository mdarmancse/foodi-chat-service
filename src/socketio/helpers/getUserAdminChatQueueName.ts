export function getUserAdminChatQueueName(userId: string | number) {
  return `chat:user:admin:queue:${userId}`;
}

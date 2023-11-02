import { redis } from "storage";

export async function getTicketUser(ticketId: string) {
  const userId = await redis.GETDEL(`chat:ticket:${ticketId}`);
  return Number(userId);
}

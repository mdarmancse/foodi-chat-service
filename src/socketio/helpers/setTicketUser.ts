import { redis } from "storage";

export async function setTicketUser(ticketId: string, userId: number) {
  await redis.SET(`chat:ticket:${ticketId}`, userId);
}

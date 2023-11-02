import { DateTime } from "luxon";

export function getTicketId(userId: number) {
  return `${DateTime.now().toFormat("yyLLdd")}-u${userId}`;
}

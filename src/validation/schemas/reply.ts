import { z } from "zod";
import { MessageSchema } from "./message";

export const ReplySchema = z
  .object({
    ticketId: z.string({
      required_error: "Ticket ID is required",
      invalid_type_error: "Invalid ticket ID",
    }),
  })
  .merge(MessageSchema.pick({ content: true, fileUrls: true }));

import { z } from "zod";

export const CreateRoomSchema = z.object({
  recipientId: z.number({
    required_error: "Recipient ID is required",
    invalid_type_error: "Invalid recipient ID",
  }),
});

import { z } from "zod";

export const AllocateRoomSchema = z.object({
  participantIds: z
    .array(z.string().uuid("Invalid ID"))
    .min(2, "Minimum 2 participants required"),
});

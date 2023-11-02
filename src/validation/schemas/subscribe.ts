import { z } from "zod";

export const SubscribeSchema = z.object({
  roomIds: z.array(z.string()),
});

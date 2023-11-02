import { z } from "zod";

export const MessageSchema = z.object({
  roomId: z
    .string({
      required_error: "Room ID is required",
      invalid_type_error: "Invalid room ID",
    })
    .optional(),
  recipientId: z
    .number({
      required_error: "Recipient ID is required",
      invalid_type_error: "Invalid recipient ID",
    })
    .optional(),
  fileUrls: z.array(z.string()).optional().default([]),
  content: z.string().optional().default(""),
});

export const RefinedMessageSchema = MessageSchema.superRefine((val, ctx) => {
  if (!val.roomId && !val.recipientId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either room ID or recipient ID is required",
    });
    return z.NEVER;
  }

  if (val.roomId && val.recipientId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either room ID or recipient ID is required",
    });
    return z.NEVER;
  }
});

export type MessageType = z.infer<typeof MessageSchema>;
export type RefinedMessageType = z.infer<typeof RefinedMessageSchema>;

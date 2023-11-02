import { MessageSchema } from "./message";

export const MessageToAdminsSchema = MessageSchema.pick({
  content: true,
  fileUrls: true,
});

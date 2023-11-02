import { RefinedMessageSchema, errorResponse } from "validation";
import { handleIncomingMessage, socketHandler } from "../helpers";

export const message = socketHandler(async (socket, msg, namespace) => {
  // validate message
  const parsed = RefinedMessageSchema.safeParse(msg);
  if (!parsed.success) {
    socket.emit("error", errorResponse(parsed.error));
    return;
  }
  const { data } = parsed;

  handleIncomingMessage(data, socket.data.user, (msg) =>
    socket.emit("error", errorResponse("Room not found")),
  );
});

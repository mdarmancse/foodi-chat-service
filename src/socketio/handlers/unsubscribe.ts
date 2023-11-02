import { UnsubscribeSchema, errorResponse } from "validation";
import { checkUser, socketHandler } from "../helpers";

export const unsubscribe = socketHandler(async (socket, msg) => {
  if (!checkUser(socket)) {
    socket.disconnect();
    return;
  }

  // validate
  const parsed = UnsubscribeSchema.safeParse(msg);
  if (!parsed.success) {
    socket.emit("error", errorResponse(parsed.error));
    return;
  }
  const { data } = parsed;

  data.roomIds.forEach((id) => {
    socket.leave(id);
  });
});

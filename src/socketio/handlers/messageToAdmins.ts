import { redis } from "storage";
import { MessageToAdminsSchema, errorResponse } from "validation";
import {
  checkUser,
  getIO,
  getUserAdminChatQueueName,
  socketHandler,
} from "../helpers";
import { AdminsRoom } from "socketio/constants";

export const messageToAdmins = socketHandler(async (socket, msg, namespace) => {
  if (!checkUser(socket)) {
    socket.disconnect();
    return;
  }

  // validate message
  const parsed = MessageToAdminsSchema.safeParse(msg);
  if (!parsed.success) {
    socket.emit("error", errorResponse(parsed.error));
    return;
  }
  const { data } = parsed;

  // queue this message to redis
  await redis.LPUSH(
    getUserAdminChatQueueName(socket.data.user?._id || ""),
    JSON.stringify(data),
  );

  // broadcast to admins room
  getIO(namespace)
    ?.to(AdminsRoom)
    .emit("messageForAdmins", { ...data, user: socket.data.user });
});

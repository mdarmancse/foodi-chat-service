import { redis } from "storage";
import { OnlineUsersRoom } from "../constants";
import { getIO, getOnlineUsersQueueName, socketHandler } from "../helpers";

export const disconnect = socketHandler(async (socket, payload, namespace) => {
  if (socket.data.user && namespace === "/") {
    const id = socket.data.user.id;
    const queueName = getOnlineUsersQueueName(id);
    await redis.LREM(queueName, 0, id.toString());

    getIO()?.to(OnlineUsersRoom).emit("disconnected", socket.data.user);
  }
});

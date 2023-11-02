import { Socket } from "socket.io";
import { redis } from "storage";
import { OnlineUsersRoom } from "../constants";
import { getIO, getOnlineUsersQueueName } from "../helpers";
import jwt from "jsonwebtoken";
import { pick } from "lodash";

export async function authenticate(
  socket: Socket,
  next: Function,
  namespace = "/",
) {
  let token: string = socket.handshake.auth.token || "";
  if (!token) {
    token = socket.handshake.headers["authorization"]?.split(" ")[1] || "";
  }

  if (!token) {
    next(new Error("Unauthorized"));
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "") as User;
    socket.data.user = pick(payload, ["id"]);

    // put user in online users list
    // TODO: maybe we want to get the user information from redis/service
    // as well for better readability
    if (namespace === "/") {
      const queueName = getOnlineUsersQueueName(payload.id);
      await redis.LPUSH(queueName, payload.id.toString());
      getIO()?.to(OnlineUsersRoom).emit("connected", socket.data.user);
    }

    next();
  } catch (_) {
    next(new Error("Unauthorized"));
  }
}

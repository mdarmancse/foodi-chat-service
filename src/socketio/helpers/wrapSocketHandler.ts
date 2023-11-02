import { Socket } from "socket.io";
import { SocketEventHandlerWrapper } from "./types";

export function wrapSocketHandler(
  socket: Socket,
  handler: SocketEventHandlerWrapper,
  namespace = "/",
) {
  return handler(socket, namespace);
}

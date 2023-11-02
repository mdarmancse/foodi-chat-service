import { Socket } from "socket.io";

export function checkUser(socket: Socket) {
  return !!socket.data.user;
}

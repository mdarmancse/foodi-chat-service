import { OnlineUsersRoom } from "../constants";
import { checkUser, socketHandler } from "../helpers";

export const subscribeToOnlineUsers = socketHandler(async (socket, msg) => {
  socket.join(OnlineUsersRoom);
});

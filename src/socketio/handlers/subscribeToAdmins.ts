import { AdminsRoom } from "socketio/constants";
import { checkUser, socketHandler } from "../helpers";

export const subscribeToAdmins = socketHandler(async (socket, msg) => {
  // TODO: check if the user is admin user
  socket.join(AdminsRoom);
});

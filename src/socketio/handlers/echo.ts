import { socketHandler } from "../helpers";

export const echo = socketHandler(async (socket, msg, namespace) => {
  console.log("from echo:", { user: socket.data.user }, namespace);
  socket.emit("echo", msg);
});

import { ChatRoom } from "models";
import { SubscribeSchema, errorResponse } from "validation";
import { checkUser, socketHandler } from "../helpers";

export const subscribe = socketHandler(async (socket, msg) => {
  // validate message
  const parsed = SubscribeSchema.safeParse(msg);
  if (!parsed.success) {
    socket.emit("error", errorResponse(parsed.error));
    return;
  }
  const { data } = parsed;

  // restrict to only room where the user is connected
  const rooms = await ChatRoom.find({
    _id: { $in: data.roomIds },
    participantIds: socket.data.user.id,
  });

  const roomIds = rooms.map((room) => room._id.toString());

  // join to rooms
  roomIds.forEach((id) => {
    socket.join(id);
  });
});

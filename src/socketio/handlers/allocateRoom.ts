import { ChatRoom } from "models";
import { AllocateRoomSchema, errorResponse } from "validation";
import { checkUser, getIO, socketHandler } from "../helpers";

export const allocateRoom = socketHandler(async (socket, msg, namespace) => {
  if (!checkUser(socket)) {
    socket.disconnect();
    return;
  }

  // validate message
  const parsed = AllocateRoomSchema.safeParse(msg);
  if (!parsed.success) {
    socket.emit("error", errorResponse(parsed.error));
    return;
  }
  const { data } = parsed;

  // find existing room for the given participants
  let room = await ChatRoom.findOne({
    participantIds: { $all: data.participantIds },
  });
  if (!room) {
    room = await ChatRoom.create(data);
  }
  room = await room.populate("participantIds");

  // let all online participants know
  const sockets = await getIO(namespace)?.fetchSockets();
  const participantSockets = sockets?.filter((socket) =>
    data.participantIds.some(
      (id) => id.toString() === socket.data.user?._id.toString(),
    ),
  );
  participantSockets?.forEach((socket) => {
    socket.emit("roomCreated", room?.toObject());
  });
});

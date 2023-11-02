import { ChatRoom } from "models";
import { redis } from "storage";
import { ReplySchema, errorResponse } from "validation";
import {
  socketHandler,
  checkUser,
  getUserAdminChatQueueName,
  getIO,
  getTicketUser,
} from "../helpers";
import { omit } from "lodash";

export const reply = socketHandler(async (socket, msg, namespace) => {
  // TODO: check if the user is admin user

  // validate data
  const parsed = ReplySchema.safeParse(msg);
  if (!parsed.success) {
    socket.emit("error", errorResponse(parsed.error));
    return;
  }
  const { data } = parsed;

  // get ticket's user
  const userId = await getTicketUser(data.ticketId);
  if (!userId) {
    socket.emit("error", errorResponse("User not found"));
    return;
  }

  // find or create room for users
  const participants = [userId, socket.data.user?.id];
  let room = await ChatRoom.findOne({
    ticketId: data.ticketId,
    participantIds: { $all: participants },
  });
  if (!room) {
    room = await ChatRoom.create({
      ticketId: data.ticketId,
      participantIds: participants,
    });
  }

  // get queued messages from redis
  const msgStrings = await redis.LRANGE(
    getUserAdminChatQueueName(userId),
    0,
    -1,
  );
  let messages = msgStrings
    .map((s) => JSON.parse(s))
    .map((msg) => ({ ...msg, senderId: userId }));
  messages.push({
    ...omit(data, ["ticketId"]),
    timestamp: new Date().toISOString(),
    senderId: socket.data.user?.id,
  });

  // remove queue
  await redis.DEL(getUserAdminChatQueueName(userId));

  // update room
  room = await ChatRoom.findOneAndUpdate(
    { _id: room._id },
    {
      $push: {
        messages,
      },
    },
    {
      new: true,
    },
  );

  // send room created to both participants
  const sockets = await getIO(namespace)?.fetchSockets();
  const participantSockets = sockets?.filter(
    (socket) =>
      room?.participantIds.some(
        (id) => id.toString() === socket.data.user?.id.toString(),
      ),
  );
  participantSockets?.forEach((socket) => {
    socket.emit("room-created", room?.toObject());
    socket.join(room?._id.toString() || "");
  });
});

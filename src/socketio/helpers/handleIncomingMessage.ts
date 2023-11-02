import { pick } from "lodash";
import { ChatRoom } from "models";
import { RefinedMessageType } from "validation";
import { subscribeAllToRoom } from "./subscribeAllToRoom";
import { getIO } from "./io";

export async function handleIncomingMessage(
  data: RefinedMessageType,
  user?: User,
  onError?: (message: string) => void,
) {
  let participantIds = [user?.id as number, data.recipientId as number];

  // get room
  let room: any = null;
  if (data.roomId) {
    room = await ChatRoom.findOne({
      _id: data.roomId,
      participantIds: user?.id,
    });

    if (!room) {
      onError?.("Room not found");
      return;
    }
  } else {
    room = await ChatRoom.findOne({
      participantIds: {
        $all: participantIds,
      },
    });
    if (!room) {
      room = await ChatRoom.create({ participantIds });
    }
  }

  participantIds = room.participantIds;

  const message = {
    ...pick(data, ["content", "fileUrls"]),
    senderId: user?.id,
    timestamp: new Date(),
  };

  const messageWithRoomId = {
    ...message,
    roomId: room._id,
  };

  // update database
  room
    .updateOne({
      $push: {
        messages: message,
      },
    })
    .exec();

  // subscribe both users
  await subscribeAllToRoom(participantIds, room._id.toString());

  // broadcast message to room
  getIO()?.to(room._id.toString()).emit("message", messageWithRoomId);

  // return prepared response
  return messageWithRoomId;
}

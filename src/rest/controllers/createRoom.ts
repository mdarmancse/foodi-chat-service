import asyncHandler from "express-async-handler";
import { z } from "zod";
import { CreateRoomSchema } from "validation";
import { ChatRoom } from "models";
import { subscribeAllToRoom } from "socketio";
import { sendData } from "rest/helpers";

type CreateRoomFormData = z.infer<typeof CreateRoomSchema>;

export const createRoom = asyncHandler(async (req, res) => {
  const data = req.body as CreateRoomFormData;

  // find or create room
  const participantIds = [req.user?.id as number, data.recipientId];
  let room = await ChatRoom.findOne({
    participantIds: {
      $all: participantIds,
    },
  });
  if (!room) {
    room = await ChatRoom.create({ participantIds });
  }

  // subscribe both to the room
  await subscribeAllToRoom(participantIds, room._id.toString());

  // respond
  sendData(res, room);
});

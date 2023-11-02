import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { ChatRoom } from "models";
import { sendData, sendError } from "rest/helpers";

export const getMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await ChatRoom.findOne({
    _id: roomId,
    participantIds: req.user?.id,
  }).select("messages");
  if (!room) {
    sendError(res, {
      status: StatusCodes.NOT_FOUND,
      message: "Room not found",
    });
    return;
  }

  sendData(res, room.messages);
});

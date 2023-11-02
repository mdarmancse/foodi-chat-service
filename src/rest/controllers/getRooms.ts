import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { ChatRoom } from "models";
import { sendData } from "rest/helpers";

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await ChatRoom.find({ participantIds: req.user?.id }).select(
    "-messages",
  );

  sendData(res, rooms);
});

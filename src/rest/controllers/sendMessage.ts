import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { pick } from "lodash";
import { ChatRoom } from "models";
import { sendData, sendError } from "rest/helpers";
import { getIO, handleIncomingMessage, subscribeAllToRoom } from "socketio";
import { MessageSchema, RefinedMessageType } from "validation";
import { z } from "zod";

export const sendMessage = asyncHandler(async (req, res) => {
  const body = req.body as RefinedMessageType;

  const messageWithRoomId = await handleIncomingMessage(body, req.user, (msg) =>
    sendError(res, {
      status: StatusCodes.NOT_FOUND,
      message: "Room not found",
    }),
  );

  // respond
  if (messageWithRoomId) {
    sendData(res, messageWithRoomId);
  }
});

import asyncHandler from "express-async-handler";
import { sendData } from "rest/helpers";
import {
  AdminsRoom,
  getIO,
  getTicketId,
  getUserAdminChatQueueName,
  setTicketUser,
} from "socketio";
import { redis } from "storage";
import { MessageToAdminsSchema } from "validation";
import { z } from "zod";

type MessageToAdminsRequest = z.infer<typeof MessageToAdminsSchema>;

export const messageToAdmins = asyncHandler(async (req, res) => {
  const data = req.body as MessageToAdminsRequest;
  const ticketId = getTicketId(req.user?.id || 0);

  // keep track of the ticket and user
  setTicketUser(ticketId, req.user?.id || 0);

  // add message to redis
  await redis.LPUSH(
    getUserAdminChatQueueName(req.user?.id || 0),
    JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
  );

  // broadcast to socketio room
  getIO()
    ?.to(AdminsRoom)
    .emit("message-for-admins", { ...data, ticketId, user: req.user });

  // respond
  sendData(res, { ...data, ticketId });
});

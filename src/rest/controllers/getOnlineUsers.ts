import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { uniqBy } from "lodash";
import { sendData } from "rest/helpers";
import { PartitionCount } from "socketio";
import { redis } from "storage";

export const getOnlineUsers = asyncHandler(async (req, res) => {
  const promises = [];
  for (let i = 0; i < PartitionCount; i++) {
    promises.push(redis.LRANGE(`chat:online-users:${i}`, 0, -1));
  }
  const results = await Promise.allSettled(promises);
  const users = results
    .map((result) => (result.status === "fulfilled" ? result.value : []))
    .flat()
    .map((userId) => parseInt(userId));

  const uniqUsers = uniqBy(users, (u) => u);

  sendData(res, uniqUsers);
});

import asyncHandler from "express-async-handler";
import { Upload } from "models";
import { sendData } from "rest/helpers";

export const uploads = asyncHandler(async (req, res) => {
  const files = await Upload.find({ userId: req.user?.id });
  sendData(res, files);
});

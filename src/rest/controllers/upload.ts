import asyncHandler from "express-async-handler";
import { Upload } from "models";
import { sendData } from "rest/helpers";

export const upload = asyncHandler(async (req, res) => {
  const uploads = (req.files as S3File[])?.map((file) => ({
    userId: req.user?.id as number,
    fileUrl: file.key,
  }));

  const resp = await Upload.create(uploads);
  sendData(res, resp);
});

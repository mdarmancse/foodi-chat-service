import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Upload } from "models";
import { sendData, sendError } from "rest/helpers";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import { S3Bucket, S3Client } from "rest/middlewares";

export const deleteUpload = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    userId: req.user?.id,
    _id: req.params.id,
  });

  if (!upload) {
    sendError(res, {
      status: StatusCodes.NOT_FOUND,
      message: "Upload not found",
    });
    return;
  }

  try {
    await S3Client.send(
      new DeleteObjectCommand({
        Bucket: S3Bucket,
        Key: upload.fileUrl,
      }),
    );
    await upload.deleteOne();
    sendData(res, upload);
  } catch {
    sendError(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Sorry, failed to delete file",
    });
  }
});

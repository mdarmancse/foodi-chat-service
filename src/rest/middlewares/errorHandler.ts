import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError } from "rest/helpers";
import multer from "multer";
import { FileTypeError } from "./storage";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  console.trace(err);

  if (err instanceof multer.MulterError || err instanceof FileTypeError) {
    sendError(res, {
      message: err.message,
    });
    return;
  }

  sendError(res, {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Sorry, something went wrong",
  });
}

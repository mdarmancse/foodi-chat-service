import "express";

declare global {
  interface User {
    id: number;
  }

  type S3File = Express.MulterS3.File;

  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

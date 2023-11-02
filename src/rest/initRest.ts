import { Express, Router } from "express";
import {
  authenticate,
  initErrorHandler,
  initGlobalMiddlewares,
  multiUpload,
} from "./middlewares";
import {
  getRooms,
  getMessages,
  getOnlineUsers,
  createRoom,
  upload,
  uploads,
  deleteUpload,
  sendMessage,
  messageToAdmins,
} from "./controllers";
import { validateBody } from "./middlewares/validateBody";
import {
  CreateRoomSchema,
  MessageToAdminsSchema,
  RefinedMessageSchema,
} from "validation";

export function initRest(app: Express) {
  // global middleware
  initGlobalMiddlewares(app);

  // initialize routes
  const router = Router();

  router.post(
    "/create-room",
    authenticate,
    validateBody(CreateRoomSchema),
    createRoom,
  );
  router.get("/rooms", authenticate, getRooms);
  router.get("/messages/:roomId", authenticate, getMessages);
  router.get("/online-users", authenticate, getOnlineUsers);
  router.post("/upload", authenticate, multiUpload("files"), upload);
  router.get("/uploads", authenticate, uploads);
  router.delete("/uploads/:id", authenticate, deleteUpload);
  router.post(
    "/send-message",
    authenticate,
    validateBody(RefinedMessageSchema),
    sendMessage,
  );
  router.post(
    "/message-to-admins",
    authenticate,
    validateBody(MessageToAdminsSchema),
    messageToAdmins,
  );

  // attach routes
  app.use(router);

  // global error handler
  initErrorHandler(app);
}

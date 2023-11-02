import { createAdapter } from "@socket.io/redis-adapter";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { redis } from "storage";
import {
  disconnect,
  echo,
  message,
  reply,
  subscribe,
  subscribeToAdmins,
  subscribeToOnlineUsers,
} from "./handlers";
import { clearOnlineUsers, setIO, wrapSocketHandler } from "./helpers";
import { authenticate } from "./middlewares";

export function initSocketIO(server: HttpServer) {
  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();

  Promise.allSettled([
    pubClient.connect(),
    subClient.connect(),
    clearOnlineUsers(),
  ]).then(() => {
    /* Main Namespace */
    const io = new Server(server, {
      adapter: createAdapter(pubClient, subClient),
      cors: {
        origin: "*",
      },
    });
    setIO(io, "/");

    // authenticate user by jwt.
    // on success attaches user to socket.data.user
    io.use((socket, next) => {
      Promise.resolve(authenticate(socket, next));
    });

    // register various event handlers
    registerMainNamespaceEvents(io);
  });
}

function registerMainNamespaceEvents(io: Server) {
  io.on("connection", (socket) => {
    // example event handler registration
    socket.on("echo", wrapSocketHandler(socket, echo));

    // disconnect handler
    // NOTE: for any clean up code update this handler
    socket.on("disconnect", wrapSocketHandler(socket, disconnect));

    // subscribe user
    socket.on("subscribe", wrapSocketHandler(socket, subscribe));

    // user sent messages
    socket.on("message", wrapSocketHandler(socket, message));

    // subscribe to admins room
    socket.on(
      "subscribe-to-admins",
      wrapSocketHandler(socket, subscribeToAdmins),
    );

    // subscribe to online users room
    socket.on(
      "subscribe-to-online-users",
      wrapSocketHandler(socket, subscribeToOnlineUsers),
    );

    // reply from admin user
    socket.on("reply", wrapSocketHandler(socket, reply));
  });
}

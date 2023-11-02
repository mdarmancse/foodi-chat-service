import { Socket } from "socket.io";

export type SocketEventHandler = (
  socket: Socket,
  message: unknown,
  namespace?: string,
) => void | Promise<void>;

export type SocketEventHandlerWrapper = (
  socket: Socket,
  namespace: string,
) => SocketMessageHandler;

export type SocketMessageHandler = (message: unknown) => void | Promise<void>;

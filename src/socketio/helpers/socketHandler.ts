import { SocketEventHandler, SocketEventHandlerWrapper } from "./types";

export function socketHandler(
  callback: SocketEventHandler,
): SocketEventHandlerWrapper {
  return (socket, namespace) => {
    return (msg) => {
      Promise.resolve(callback(socket, msg, namespace));
    };
  };
}

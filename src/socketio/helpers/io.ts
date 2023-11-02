import { Server, Namespace } from "socket.io";

type IONamespace = { [key: string]: Server | Namespace | undefined };

const _namespaces: IONamespace = {};

export function setIO(io: Server | Namespace, namespace: string) {
  _namespaces[namespace] = io;
}

export function getIO(namespace = "/") {
  return _namespaces[namespace];
}

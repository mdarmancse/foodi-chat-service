import { getIO } from "./io";

export async function subscribeAllToRoom(
  userIds: number[],
  roomId: string,
  namespace = "/",
) {
  // TODO: optimize it, don't want to filter everytime
  // we want to subscribe
  const sockets = await getIO(namespace)?.fetchSockets();
  const userSockets = sockets?.filter((socket) =>
    userIds.some((uId) => uId === socket.data.user.id),
  );

  userSockets?.forEach((socket) => {
    socket.join(roomId);
  });
}

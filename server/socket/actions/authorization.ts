import { SocketResponses } from '/shared/payloads/socketResponses.ts';
import { SocketPayload } from '/shared/payloads/socketPayload.ts';

import { getUserByToken } from '/server/database.ts';

export const authorizeConnection = (
  socket: WebSocket,
): Promise<[true, string] | [false, null]> => {
  return new Promise((resolve) => {
    let authorized = false;

    setTimeout(() => {
      if (!authorized) socket.close(...SocketResponses.UNAUTHORIZED);
      resolve([false, null]);
    }, 5000);

    socket.addEventListener('message', ({ data }) => {
      const payload = SocketPayload.fromString(data);

      if (payload === null || payload.type !== 'auth') return;

      if (payload.token) {
        const user = getUserByToken(payload.token);
        authorized = user !== undefined;
      }

      if (authorized) {
        resolve([true, payload.token]);
      }
    });
  });
};

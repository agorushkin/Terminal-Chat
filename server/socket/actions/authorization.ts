import { SocketAuthPayload } from '/shared/payloads/socketPayloadTypes.ts';
import { SocketResponses } from '/shared/payloads/socketResponses.ts';

import { cache } from '/shared/cache.ts';
import * as SQL from '../../database.ts';

import { db } from '/server/main.ts';

export const startAuthorization = (socket: WebSocket) => {
  let authorized = false;

  setTimeout(() => {
    if (!authorized) socket.close(...SocketResponses.UNAUTHORIZED);
  }, 5000);

  return (payload: SocketAuthPayload) => {
    const { token } = payload;

    if (!token) {
      socket.close();
    }

    const user = cache(token, () => {
      return db.prepare(SQL.GET_USER_BY_TOKEN(token)).value();
    });

    authorized = user !== undefined;
  };
};

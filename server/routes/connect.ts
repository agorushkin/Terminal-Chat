import { Handler } from 'x/http';

import { match } from '/shared/match.ts';
import { SocketPayload } from '/shared/payloads/socketPayload.ts';

import { authorizeConnection } from '/server/socket/actions/authorization.ts';
import { startHeartbeat } from '/server/socket/actions/heartbeat.ts';
import { startBroadcast } from '/server/socket/broadcast.ts';

import { connections } from '/server/main.ts';

export const handleWebsocketConnection: Handler = async (
  { responded, upgrade },
): Promise<void> => {
  if (responded) return;

  const socket = await upgrade();
  if (!socket) return;

  const [authorized, token] = await authorizeConnection(socket);
  if (!authorized) return;

  connections.set(token, socket);

  socket.addEventListener('close', () => connections.delete(token));

  const heartbeat = startHeartbeat(socket);
  startBroadcast(socket, token);

  socket.addEventListener('message', ({ data }) => {
    const payload = SocketPayload.fromString(data);

    if (payload === null) return;

    match(payload.type, {
      'heartbeat': () => heartbeat(),
      'auth': () => null,
      'message': () => null,
      '_': () => null,
    });
  });
};

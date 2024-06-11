import { Handler } from 'x/http';

import { match } from '/shared/match.ts';
import { SocketPayload } from '/shared/payloads/socketPayload.ts';
import { SocketAuthPayload } from '/shared/payloads/socketPayloadTypes.ts';

import { startHeartbeat } from '/server/socket/actions/heartbeat.ts';
import { startAuthorization } from '/server/socket/actions/authorization.ts';

export const handleWebsocketConnection: Handler = async (
  { responded, upgrade },
): Promise<void> => {
  if (responded) return;

  const socket = await upgrade();
  if (!socket) return;

  const heartbeat = startHeartbeat(socket);
  const auth = startAuthorization(socket);

  socket.addEventListener('message', ({ data }) => {
    const payload = SocketPayload.fromString(data);

    if (payload === null) return;

    match(payload.type, {
      'heartbeat': () => heartbeat(),
      'auth': () => auth(payload as SocketAuthPayload),
      'message': () => null,
      '_': () => null,
    });
  });
};

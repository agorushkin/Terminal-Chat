import { SocketPayload } from '/shared/payloads/socketPayload.ts';
import { SocketResponses } from '/shared/payloads/socketResponses.ts';

export const startHeartbeat = (socket: WebSocket) => {
  let responded = true;

  const interval = setInterval(() => {
    if (!responded) {
      socket.close(...SocketResponses.HEARTBEAT_UNANSWERED);
      clearInterval(interval);
      return;
    }

    const payload = new SocketPayload({ type: 'heartbeat' });
    socket.send(payload.toString());

    responded = false;
  }, 10000);

  return () => {
    responded = true;
  };
};

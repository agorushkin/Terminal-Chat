import { SocketPayload } from '../shared/payloads/socketPayload.ts';

const socket = new WebSocket('ws://localhost:8080/connect');

socket.addEventListener('open', () => {
  console.log('Connected to server');

  socket.send('{"type":"join","room":"test"}');
});

socket.addEventListener('message', (event) => {
  const payload = SocketPayload.fromString(event.data);

  if (!payload) return;

  switch (payload.type) {
    case 'heartbeat':
      socket.send(new SocketPayload({ type: 'heartbeat' }).toString());
      break;

    case 'message':
      console.log(payload.message);
      break;

    default:
      break;
  }
});

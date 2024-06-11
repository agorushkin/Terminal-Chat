import { broadcaster } from '/server/main.ts';
import { getUserChannels } from '/server/database.ts';

export const startBroadcast = (socket: WebSocket, token: string) => {
  const channels = getUserChannels(token);
  if (!channels) return;

  for (const channel of channels) {
    broadcaster.subscribe(channel, socket);
  }
};

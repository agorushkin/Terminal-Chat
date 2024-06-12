import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { SocketPayload } from '/shared/payloads/socketPayload.ts';

import { checkChannelExists, getUserByToken } from '/server/database.ts';
import { broadcaster } from '/server/main.ts';

export const sendMessage: Handler = async (
  { response, responded, params, text, headers },
): Promise<void> => {
  if (responded) return;

  const token = headers.get('Authorization')!;
  const channelId = params.get('channel');

  if (!channelId) {
    response = { ...response, ...HttpResponses.BAD_REQUEST };
    return;
  }

  const channel = checkChannelExists(channelId);
  if (!channel) {
    response = { ...response, ...HttpResponses.CHANNEL_NOT_FOUND };
    return;
  }

  const author = getUserByToken(token)!;

  const message = HttpPayload.fromString(await text());
  if (!message || message.type !== 'message') {
    response = { ...response, ...HttpResponses.BAD_REQUEST };
    return;
  }

  const payload = new SocketPayload({
    type: 'message',
    content: message.content,
    author: author,
  });

  broadcaster.broadcast(channel, payload.toString());
};

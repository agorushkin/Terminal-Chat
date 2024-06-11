import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { SocketPayload } from '/shared/payloads/socketPayload.ts';

import * as db from '/server/database.ts';
import { broadcaster } from '/server/main.ts';

export const sendMessage: Handler = async (
  { responded, params, text, respond },
): Promise<void> => {
  if (responded) return;

  const token = 'test';
  const channelId = params.get('channel');

  if (!channelId) {
    return respond(HttpResponses.CHANNEL_NOT_FOUND);
  }

  const channel = db.checkChannelExists(channelId);
  if (!channel) return respond(HttpResponses.CHANNEL_NOT_FOUND);

  const author = db.getUserByToken(token);
  if (!author) return respond(HttpResponses.UNAUTHORIZED);

  const message = HttpPayload.fromString(await text());
  if (!message || message.type !== 'message') {
    return respond(HttpResponses.BAD_REQUEST);
  }

  const payload = new SocketPayload({
    type: 'message',
    content: message.content,
    author: author,
  });

  broadcaster.broadcast(channel, payload.toString());
  respond({ status: 200 });
};

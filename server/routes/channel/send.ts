import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { SocketPayload } from '/shared/payloads/socketPayload.ts';

import { checkChannelExists, getUserByToken } from '/server/database.ts';
import { broadcaster } from '/server/main.ts';

export const sendMessage: Handler = async (request): Promise<void> => {
  if (request.responded) return;

  const token = request.headers.get('Authorization')!;
  const channelId = request.params.get('channel');
  const response = request.response;

  if (!channelId) {
    response.status = HttpResponses.BAD_REQUEST.status;
    response.body = HttpResponses.BAD_REQUEST.body;
    return;
  }

  const channel = checkChannelExists(channelId);
  if (!channel) {
    response.status = HttpResponses.NOT_FOUND.status;
    response.body = HttpResponses.NOT_FOUND.body;
    return;
  }

  const author = getUserByToken(token)!;

  const message = HttpPayload.fromString(await request.text());
  if (!message || message.type !== 'message') {
    response.status = HttpResponses.BAD_REQUEST.status;
    response.body = HttpResponses.BAD_REQUEST.body;
    return;
  }

  const payload = new SocketPayload({
    type: 'message',
    content: message.content,
    author: author,
  });

  broadcaster.broadcast(channel, payload.toString());

  response.status = HttpResponses.OK.status;
  response.body = HttpResponses.OK.body;
};

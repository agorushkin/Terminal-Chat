import { Handler } from 'x/http';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { HttpChannelCreatePayload } from '/shared/payloads/httpPayloadTypes.ts';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

import {
  checkChannelExists,
  createChannel,
  getUserByToken,
} from '/server/database.ts';

import { broadcaster, connections } from '/server/main.ts';

export const createNewChannel: Handler = async (request) => {
  if (request.responded) return;

  const token = request.headers.get('Authorization')!;
  const response = request.response;

  const payload = HttpPayload.fromString(await request.text());
  if (!payload || payload.type !== 'channel-create') {
    response.status = HttpResponses.BAD_REQUEST.status;
    response.body = HttpResponses.BAD_REQUEST.body;
    return;
  }

  const { name: channel } = payload as HttpChannelCreatePayload;

  const nameTaken = checkChannelExists(channel);
  if (nameTaken) {
    response.status = HttpResponses.CONFLICT.status;
    response.body = HttpResponses.CONFLICT.body;
    return;
  }

  const user = getUserByToken(token)!;

  const socket = connections.get(token);
  if (socket) broadcaster.subscribe(channel, socket);

  createChannel(channel, user);

  response.status = HttpResponses.OK.status;
  response.body = HttpResponses.OK.body;
};

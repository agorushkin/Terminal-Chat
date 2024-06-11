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

export const createNewChannel: Handler = async (
  { respond, text, headers },
) => {
  const token = headers.get('Authorization')!;

  const payload = HttpPayload.fromString(await text());
  if (!payload || payload.type !== 'channel-create') {
    return respond(HttpResponses.BAD_REQUEST);
  }

  const { name: channel } = payload as HttpChannelCreatePayload;

  const nameTaken = checkChannelExists(channel);
  if (nameTaken) return respond(HttpResponses.CHANNEL_NAME_EXISTS);

  const user = getUserByToken(token)!;

  const socket = connections.get(token);
  if (socket) broadcaster.subscribe(channel, socket);

  createChannel(channel, user);
  respond(HttpResponses.OK);
};

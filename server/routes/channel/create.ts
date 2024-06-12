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
  { response, responded, text, headers },
) => {
  if (responded) return;

  const token = headers.get('Authorization')!;

  const payload = HttpPayload.fromString(await text());
  if (!payload || payload.type !== 'channel-create') {
    response = { ...response, ...HttpResponses.BAD_REQUEST };
    return;
  }

  const { name: channel } = payload as HttpChannelCreatePayload;

  const nameTaken = checkChannelExists(channel);
  if (nameTaken) {
    response = { ...response, ...HttpResponses.CHANNEL_NAME_EXISTS };
    return;
  }

  const user = getUserByToken(token)!;

  const socket = connections.get(token);
  if (socket) broadcaster.subscribe(channel, socket);

  createChannel(channel, user);
};

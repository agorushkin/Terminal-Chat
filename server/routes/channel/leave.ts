import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

import {
  checkChannelExists,
  checkUserInChannel,
  getUserByToken,
  removeUserFromChannel,
} from '/server/database.ts';

import { broadcaster, connections } from '/server/main.ts';

export const leaveChannel: Handler = (
  { response, responded, params, headers },
) => {
  if (responded) return;

  const token = headers.get('Authorization')!;

  const channel = params.get('channel');
  if (!channel || isNaN(parseInt(channel))) {
    response = { ...response, ...HttpResponses.BAD_REQUEST };
    return;
  }

  const channelExists = checkChannelExists(channel);
  if (!channelExists) {
    response = { ...response, ...HttpResponses.CHANNEL_NOT_FOUND };
    return;
  }

  const user = getUserByToken(token)!;
  const isUserInChannel = checkUserInChannel(user, channel);
  if (!isUserInChannel) {
    response = { ...response, ...HttpResponses.USER_NOT_IN_CHANNEL };
    return;
  }

  const socket = connections.get(token);
  if (socket) broadcaster.unsubscribe(channel, socket);

  removeUserFromChannel(channel, user);
};

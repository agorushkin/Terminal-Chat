import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

import {
  checkChannelExists,
  checkUserInChannel,
  getUserByToken,
  removeUserFromChannel,
} from '/server/database.ts';

import { broadcaster, connections } from '/server/main.ts';

export const leaveChannel: Handler = ({ respond, params, headers }) => {
  const token = headers.get('Authorization')!;

  const channel = params.get('channel');
  if (!channel || isNaN(parseInt(channel))) {
    return respond(HttpResponses.BAD_REQUEST);
  }

  const channelExists = checkChannelExists(channel);
  if (!channelExists) return respond(HttpResponses.CHANNEL_NOT_FOUND);

  const user = getUserByToken(token)!;
  const isUserInChannel = checkUserInChannel(user, channel);

  if (!isUserInChannel) return respond(HttpResponses.USER_NOT_IN_CHANNEL);

  const socket = connections.get(token);
  if (socket) broadcaster.unsubscribe(channel, socket);

  removeUserFromChannel(channel, user);
  respond(HttpResponses.OK);
};

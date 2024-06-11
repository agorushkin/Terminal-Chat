import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

import {
  addUserToChannel,
  checkChannelExists,
  checkUserInChannel,
  getUserByToken,
} from '/server/database.ts';

import { broadcaster, connections } from '/server/main.ts';

export const joinChannel: Handler = ({ respond, params, headers }) => {
  const token = headers.get('Authorization')!;

  const channel = params.get('channel');
  if (!channel || isNaN(parseInt(channel))) {
    return respond(HttpResponses.BAD_REQUEST);
  }

  const channelExists = checkChannelExists(channel);
  if (!channelExists) return respond(HttpResponses.CHANNEL_NOT_FOUND);

  const user = getUserByToken(token)!;
  const isUserInChannel = checkUserInChannel(user, channel);

  if (isUserInChannel) return respond(HttpResponses.USER_ALREADY_IN_CHANNEL);

  const socket = connections.get(token);
  if (socket) broadcaster.subscribe(channel, socket);

  addUserToChannel(channel, user);
  respond(HttpResponses.OK);
};

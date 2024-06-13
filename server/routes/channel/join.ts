import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

import {
  addUserToChannel,
  checkChannelExists,
  checkUserInChannel,
  getUserByToken,
} from '/server/database.ts';

import { broadcaster, connections } from '/server/main.ts';

export const joinChannel: Handler = (request) => {
  if (request.responded) return;

  const token = request.headers.get('Authorization')!;
  const response = request.response;

  const channel = request.params.get('channel');
  if (!channel || isNaN(parseInt(channel))) {
    response.status = HttpResponses.BAD_REQUEST.status;
    response.body = HttpResponses.BAD_REQUEST.body;
    return;
  }

  const channelExists = checkChannelExists(channel);
  if (!channelExists) {
    response.status = HttpResponses.NOT_FOUND.status;
    response.body = HttpResponses.NOT_FOUND.body;
    return;
  }

  const user = getUserByToken(token)!;
  const isUserInChannel = checkUserInChannel(user, channel);
  if (isUserInChannel) {
    response.status = HttpResponses.CONFLICT.status;
    response.body = HttpResponses.CONFLICT.body;
    return;
  }

  const socket = connections.get(token);
  if (socket) broadcaster.subscribe(channel, socket);

  addUserToChannel(channel, user);

  response.status = HttpResponses.OK.status;
  response.body = HttpResponses.OK.body;
};

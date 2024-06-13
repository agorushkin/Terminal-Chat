import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';

import { checkUserExists, createUser } from '/server/database.ts';

export const registerUser: Handler = async (request): Promise<void> => {
  if (request.responded) return;

  const json = await request.text();
  const payload = HttpPayload.fromString(json);
  const response = request.response;

  if (!payload || payload.type !== 'registration') {
    response.status = HttpResponses.BAD_REQUEST.status;
    response.body = HttpResponses.BAD_REQUEST.body;
    return;
  }

  const user = checkUserExists(payload.username);

  if (user) {
    response.status = HttpResponses.CONFLICT.status;
    response.body = HttpResponses.CONFLICT.body;
    return;
  }

  createUser(payload.username, payload.key);
};

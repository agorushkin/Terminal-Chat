import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';

import * as db from '../../database.ts';

export const registerUser: Handler = async (
  { responded, text, respond },
): Promise<void> => {
  if (responded) return;

  const json = await text();
  const payload = HttpPayload.fromString(json);

  if (!payload || payload.type !== 'registration') {
    respond(HttpResponses.BAD_REQUEST);
    return;
  }

  const user = db.checkUserExists(payload.username);

  if (user) {
    respond(HttpResponses.USER_EXISTS);
    return;
  }

  db.createUser(payload.username, payload.key);
};

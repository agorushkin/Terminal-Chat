import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';

import { checkUserExists, createUser } from '/server/database.ts';

export const registerUser: Handler = async (
  { response, responded, text },
): Promise<void> => {
  if (responded) return;

  const json = await text();
  const payload = HttpPayload.fromString(json);

  if (!payload || payload.type !== 'registration') {
    response = { ...response, ...HttpResponses.BAD_REQUEST };
    return;
  }

  const user = checkUserExists(payload.username);

  if (user) {
    response = { ...response, ...HttpResponses.USER_EXISTS };
    return;
  }

  createUser(payload.username, payload.key);
};

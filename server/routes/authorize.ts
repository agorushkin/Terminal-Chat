import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

import { getUserByToken } from '/server/database.ts';

export const checkAuthorization: Handler = (
  { headers, href, responded, respond },
): void => {
  if (responded) return;
  const token = headers.get('Authorization');

  const path = new URL(href).pathname;

  if (path === '/register' || path === '/connect') return;

  if (!token || !getUserByToken(token)) {
    return respond(HttpResponses.UNAUTHORIZED);
  }
};

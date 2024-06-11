import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

export const checkAuthorization: Handler = (
  { headers, href, responded, respond },
): void => {
  if (responded) return;

  const authorization = headers.get('Authorization');

  if (new URL(href).pathname === '/register') return;

  if (!authorization || authorization !== 'test') {
    return respond(HttpResponses.UNAUTHORIZED);
  }
};

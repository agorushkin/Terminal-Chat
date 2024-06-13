import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { SocketResponses } from '/shared/payloads/socketResponses.ts';

import { ulid } from '/shared/ulid.ts';
import { getUserKey, getUserToken, setUserToken } from '/server/database.ts';

import { connections } from '/server/main.ts';

export const generateToken: Handler = async (request): Promise<void> => {
  console.log(1);
  if (request.responded) return;

  const json = await request.text();
  const payload = HttpPayload.fromString(json);
  const response = request.response;

  if (!payload || payload.type !== 'login') {
    request.response = { ...request.response, ...HttpResponses.BAD_REQUEST };
    return;
  }

  if (!payload.username || !payload.signature || !payload.challenge) {
    response.status = HttpResponses.BAD_REQUEST.status;
    response.body = HttpResponses.BAD_REQUEST.body;
    return;
  }

  const key = getUserKey(payload.username);

  if (!key) {
    response.status = HttpResponses.UNAUTHORIZED.status;
    response.body = HttpResponses.UNAUTHORIZED.body;
    return;
  }

  const publicKeyArrayBuffer =
    Uint8Array.from(atob(key), (c) => c.charCodeAt(0)).buffer;
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyArrayBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
    true,
    ['verify'],
  );

  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    Uint8Array.from(atob(payload.signature), (c) => c.charCodeAt(0)).buffer,
    new TextEncoder().encode(payload.challenge),
  );

  if (!isValid) {
    response.status = HttpResponses.UNAUTHORIZED.status;
    response.body = HttpResponses.UNAUTHORIZED.body;
    return;
  }

  const currentToken = getUserToken(payload.username);
  if (currentToken && connections.has(currentToken)) {
    connections.get(currentToken)?.close(...SocketResponses.LOGGED_OUT);
  }

  const token = ulid();
  setUserToken(payload.username, token);

  response.headers.append('Content-Type', 'application/json');
  response.body = new HttpPayload({ type: 'token', token }).toString();
  response.status = 200;
};

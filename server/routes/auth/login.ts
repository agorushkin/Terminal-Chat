import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { SocketResponses } from '/shared/payloads/socketResponses.ts';

import { ulid } from '/shared/ulid.ts';
import { getUserKey, getUserToken, setUserToken } from '/server/database.ts';

import { connections } from '/server/main.ts';

export const generateToken: Handler = async (
  { response, responded, text },
): Promise<void> => {
  if (responded) return;

  const json = await text();
  const payload = HttpPayload.fromString(json);

  if (!payload || payload.type !== 'login') {
    response = { ...response, ...HttpResponses.BAD_REQUEST };
    return;
  }

  if (!payload.username || !payload.signature || !payload.challenge) {
    response = { ...response, ...HttpResponses.INVALID_LOGIN_REQUEST };
    return;
  }

  const key = getUserKey(payload.username);

  if (!key) {
    response = { ...response, ...HttpResponses.USER_NOT_FOUND };
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
    response = { ...response, ...HttpResponses.INVALID_SIGNATURE };
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

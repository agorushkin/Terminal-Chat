import { Handler } from 'x/http';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { ulid } from '/shared/ulid.ts';

export const generateChallenge: Handler = (request) => {
  if (request.responded) return;

  const challenge = ulid();
  const payload = new HttpPayload({ type: 'challenge', challenge }).toString();

  const response = request.response;

  response.body = payload;
  response.status = 200;
  response.headers.append('Content-Type', 'application/json');
};

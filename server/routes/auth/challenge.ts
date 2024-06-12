import { Handler } from 'x/http';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { ulid } from '/shared/ulid.ts';

export const generateChallenge: Handler = ({ respond }) => {
  const challenge = ulid();
  const payload = new HttpPayload({ type: 'challenge', challenge }).toString();

  respond({
    body: payload,
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

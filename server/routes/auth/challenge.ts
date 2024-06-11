import { Handler } from 'x/http';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';

export const generateChallenge: Handler = ({ respond }) => {
  const challenge = crypto.randomUUID();
  const payload = new HttpPayload({ type: 'challenge', challenge }).toString();

  respond({
    body: payload,
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

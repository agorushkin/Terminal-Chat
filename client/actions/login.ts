import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { config } from '/client/main.ts';

import { signChallenge } from '/client/crypto/signChallenge.ts';
import { loadPrivateKey } from '/client/crypto/loadPrivateKey.ts';

export const login = async (username: string): Promise<string | null> => {
  const challengeReq = await fetch(`${config.address}/challenge`);
  if (!challengeReq.ok) {
    console.log('Failed to fetch challenge', challengeReq.status);
    return null;
  }

  const challengePayload = HttpPayload.fromString(await challengeReq.text());

  if (!challengePayload || challengePayload.type !== 'challenge') {
    console.log('Invalid challenge response');
    return null;
  }

  const challenge = challengePayload.challenge;
  const key = await loadPrivateKey(`${config.keys}/private.pem`);
  const signature = await signChallenge(key, challenge);

  const loginReq = await fetch(`${config.address}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: new HttpPayload({ type: 'login', username, challenge, signature })
      .toString(),
  });

  if (!loginReq.ok) {
    console.log('Failed to login', loginReq.status);
    return null;
  }

  const tokenPayload = HttpPayload.fromString(await loginReq.text());

  if (!tokenPayload || tokenPayload.type !== 'token') {
    console.log('Invalid token response');
    return null;
  }

  return tokenPayload.token;
};

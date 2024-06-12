import { HttpPayload } from '/shared/payloads/httpPayload.ts';

import { signChallenge } from '/client/crypto/signChallenge.ts';
import { loadPrivateKey } from '/client/crypto/loadPrivateKey.ts';

export const login = async (
  username: string,
  file: File,
): Promise<string | null> => {
  const challengeReq = await fetch(`http://localhost:8080/challenge`);
  if (!challengeReq.ok) {
    console.log('Failed to fetch challenge');
    return null;
  }

  const challengePayload = HttpPayload.fromString(await challengeReq.text());

  if (!challengePayload || challengePayload.type !== 'challenge') {
    console.log('Invalid challenge response');
    return null;
  }

  const challenge = challengePayload.challenge;
  const key = await loadPrivateKey(file);
  const signature = await signChallenge(key, challenge);

  const loginReq = await fetch(`http://localhost:8080/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: new HttpPayload({ type: 'login', username, challenge, signature })
      .toString(),
  });

  if (!loginReq.ok) {
    console.log(`Failed to login, ${loginReq.status}`);
    return null;
  }

  const tokenPayload = HttpPayload.fromString(await loginReq.text());

  if (!tokenPayload || tokenPayload.type !== 'token') {
    console.log('Invalid token response');
    return null;
  }

  return tokenPayload.token;
};

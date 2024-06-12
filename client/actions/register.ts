import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { config } from '/client/main.ts';

import { generateKeyPair } from '/client/crypto/generateKeyPair.ts';

export const register = async (username: string): Promise<Error | null> => {
  const confirmation = confirm(
    "Generate new keypair or use existing? If keys aren't correct, it might break the application.",
  );

  if (confirmation) {
    generateKeyPair(config.keys);

    console.log(
      `Keypair generated successfully. They are stored at ${config.keys} `,
    );
  }

  const key = await Deno.readTextFile(`${config.keys}/public.pem`);

  const registrationReq = await fetch(`${config.address}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: new HttpPayload({ type: 'registration', username, key })
      .toString(),
  });

  if (!registrationReq.ok) {
    console.log('Failed to register', registrationReq.status);
    return new Error('Failed to register');
  }

  return null;
};

export const signChallenge = async (key: CryptoKey, challenge: string) => {
  const challengeBinary = new TextEncoder().encode(challenge);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    challengeBinary,
  );

  return btoa(
    String.fromCharCode(...new Uint8Array(signature)),
  );
};

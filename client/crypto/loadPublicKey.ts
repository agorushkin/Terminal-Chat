export const loadPublicKey = async (file: string) => {
  const publicKeyPem = await Deno.readTextFile(file);
  const publicKeyArrayBuffer =
    Uint8Array.from(atob(publicKeyPem), (c) => c.charCodeAt(0)).buffer;
  return crypto.subtle.importKey(
    'spki',
    publicKeyArrayBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    true,
    ['verify'],
  );
};

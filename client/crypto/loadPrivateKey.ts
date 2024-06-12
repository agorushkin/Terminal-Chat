export const loadPrivateKey = async (file: File) => {
  const privateKeyPem = new TextDecoder().decode(await file.arrayBuffer());
  const privateKeyArrayBuffer =
    Uint8Array.from(atob(privateKeyPem), (c) => c.charCodeAt(0)).buffer;
  return crypto.subtle.importKey(
    'pkcs8',
    privateKeyArrayBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    true,
    ['sign'],
  );
};

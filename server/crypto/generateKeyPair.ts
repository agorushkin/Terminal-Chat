export const generateKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const privateKeyBase64 = btoa(
    String.fromCharCode(...new Uint8Array(privateKey)),
  );
  const publicKeyBase64 = btoa(
    String.fromCharCode(...new Uint8Array(publicKey)),
  );

  await Deno.writeTextFile('./secret/private.pem', privateKeyBase64);
  await Deno.writeTextFile('./secret/public.pem', publicKeyBase64);
};

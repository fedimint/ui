export async function encrypt(
  password: string,
  plaintext: string
): Promise<string> {
  const encoder = new TextEncoder();
  const pwUtf8 = encoder.encode(password);
  const pwKey = await crypto.subtle.importKey('raw', pwUtf8, 'PBKDF2', false, [
    'deriveKey',
  ]);

  const salt = encoder.encode('fixed-salt');

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    pwKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );

  const iv = encoder.encode('fixed-iv-123456789012'); // 12 bytes for AES-GCM

  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoder.encode(plaintext)
  );

  const ciphertextArray = new Uint8Array(ciphertextBuffer);
  const ciphertextBase64 = btoa(String.fromCharCode(...ciphertextArray));

  return ciphertextBase64;
}

export async function decrypt(
  password: string,
  ciphertextBase64: string
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const pwUtf8 = encoder.encode(password);
  const pwKey = await crypto.subtle.importKey('raw', pwUtf8, 'PBKDF2', false, [
    'deriveKey',
  ]);

  const salt = encoder.encode('fixed-salt');

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    pwKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );

  const iv = encoder.encode('fixed-iv-123456789012'); // 12 bytes for AES-GCM

  const ciphertextBytes = Uint8Array.from(atob(ciphertextBase64), (c) =>
    c.charCodeAt(0)
  );

  const plaintextBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertextBytes
  );

  return decoder.decode(plaintextBuffer);
}

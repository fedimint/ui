export function bftHonest(totalGuardians: number): number {
  return totalGuardians - bftFaulty(totalGuardians);
}

export function bftFaulty(totalGuardians: number): number {
  return Math.floor((totalGuardians - 1) / 3);
}

export const generateSimpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).slice(0, 6); // Convert to hex and take the first 6 characters
};

export const generatePassword = () => {
  const getRandomInt = (max: number) => {
    const randomBuffer = new Uint8Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return Math.floor((randomBuffer[0] / 255) * max);
  };

  const passwordLength = 16;
  const charSet =
    'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789!@#$%^&*()';

  let adminPassword = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = getRandomInt(charSet.length);
    adminPassword += charSet.charAt(randomIndex);
  }

  return adminPassword;
};

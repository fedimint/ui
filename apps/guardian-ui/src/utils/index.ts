export const bftHonest = (totalGuardians: number): number => {
  return totalGuardians - bftFaulty(totalGuardians);
};

export const bftFaulty = (totalGuardians: number): number => {
  return Math.floor((totalGuardians - 1) / 3);
};

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

  const passwordLength = 30;
  const charSet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

  let adminPassword = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = getRandomInt(charSet.length);
    adminPassword += charSet.charAt(randomIndex);
  }

  return adminPassword;
};

export const normalizeUrl = (url: string): string => {
  try {
    // Parse the URL
    const parsedUrl = new URL(url);

    // Normalize the protocol (e.g., 'ws:' to 'ws://')
    const protocol = parsedUrl.protocol.endsWith(':')
      ? parsedUrl.protocol
      : `${parsedUrl.protocol}:`;

    // Combine parts, ensuring no double slashes between protocol and host
    let normalizedUrl = `${protocol}//${parsedUrl.host}${parsedUrl.pathname}`;

    // Remove trailing slash if present, unless it's the only character in the path
    if (
      normalizedUrl.endsWith('/') &&
      normalizedUrl.length > protocol.length + 2
    ) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }

    // Preserve query parameters and hash
    normalizedUrl += parsedUrl.search + parsedUrl.hash;

    return normalizedUrl;
  } catch (error) {
    // If URL parsing fails, return the original string
    console.warn(`Failed to normalize URL: ${url}`, error);
    return url;
  }
};

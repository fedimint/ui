export const isValidNumber = (value: string, min?: number, max?: number) => {
  const int = parseInt(value, 10);
  if (Number.isNaN(int)) return false;
  if (typeof min === 'number' && int < min) return false;
  if (typeof max === 'number' && int > max) return false;
  return true;
};

export const isValidBasicSettings = (
  myName: string,
  password: string,
  confirmPassword: string,
  hostServerUrl: string,
  isHost: boolean
) =>
  Boolean(
    myName &&
      password &&
      (isHost ? password === confirmPassword : hostServerUrl)
  );

export const isValidFederationSettings = (
  isHost: boolean,
  federationName: string,
  numPeers: string
) =>
  Boolean(
    isHost ? Boolean(federationName && isValidNumber(numPeers, 4)) : true
  );

export const isValidBitcoinSettings = (
  isHost: boolean,
  network: string,
  blockConfirmations: string
) =>
  Boolean(
    isHost
      ? Boolean(isValidNumber(blockConfirmations, 1, 200) && network)
      : true
  );

export const isValidMeta = (meta: [string, string][]) => {
  return meta.every(([key, value]) => key && value);
};

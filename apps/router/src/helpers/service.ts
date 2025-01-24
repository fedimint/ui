import { Service } from '../types';

export const getServiceType = (configUrl: string): Service | null => {
  try {
    const url = new URL(configUrl);

    if (url.protocol.startsWith('ws')) {
      return Service.Guardian;
    }

    if (url.protocol.startsWith('http')) {
      return Service.Gateway;
    }

    return null;
  } catch {
    return null;
  }
};

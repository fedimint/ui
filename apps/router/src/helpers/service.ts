import { ServiceType } from '../types';

export const getServiceType = (configUrl: string): ServiceType | null => {
  try {
    const url = new URL(configUrl);

    if (url.protocol.startsWith('ws')) {
      return 'guardian';
    }

    if (url.protocol.startsWith('http')) {
      return 'gateway';
    }

    return null;
  } catch {
    return null;
  }
};

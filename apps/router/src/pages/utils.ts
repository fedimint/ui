import { Service } from '../types';

export const checkServiceExists = (
  configUrl: string,
  services: Record<string, Service>
) => {
  return Object.values({ ...services }).some(
    (s) => s.config.baseUrl === configUrl
  );
};

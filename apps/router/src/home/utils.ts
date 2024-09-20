import { Gateway, Guardian } from '../context/AppContext';

export const checkServiceExists = (
  configUrl: string,
  guardians: Record<string, Guardian>,
  gateways: Record<string, Gateway>
) => {
  return Object.values({ ...guardians, ...gateways }).some(
    (s) => s.config.baseUrl === configUrl
  );
};

export const getServiceType = (configUrl: string): 'guardian' | 'gateway' => {
  const isWebSocket =
    configUrl.startsWith('ws://') || configUrl.startsWith('wss://');
  return isWebSocket ? 'guardian' : 'gateway';
};

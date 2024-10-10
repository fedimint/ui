import { GuardianConfig } from '../types/guardian';
import { GatewayConfig } from '../types/gateway';

export const checkServiceExists = (
  configUrl: string,
  guardians: Record<string, GuardianConfig>,
  gateways: Record<string, GatewayConfig>
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

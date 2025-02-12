export type ServiceType = 'guardian' | 'gateway';

export interface ServiceConfig {
  id: string;
  baseUrl: string;
}

export interface Service {
  config: ServiceConfig;
}

export const UNIT_OPTIONS = ['msats', 'sats', 'btc'] as const;
export type Unit = (typeof UNIT_OPTIONS)[number];

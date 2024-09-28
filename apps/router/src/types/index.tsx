export type ServiceType = 'guardian' | 'gateway';

export interface ServiceConfig {
  config: {
    baseUrl: string;
  };
}

export const UNIT_OPTIONS = ['msats', 'sats', 'btc'] as const;
export type Unit = (typeof UNIT_OPTIONS)[number];

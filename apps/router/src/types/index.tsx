export type ServiceType = 'guardian' | 'gateway';

export interface ServiceConfig {
  config: {
    baseUrl: string;
  };
}

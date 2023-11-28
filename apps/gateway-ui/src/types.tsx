import { ClientConfig, Network, Fees } from '@fedimint/types';

export interface Federation {
  federation_id: string;
  balance_msat: number;
  config: ClientConfig;
}

export interface GatewayInfo {
  federations: Federation[];
  fees: Fees;
  lightning_alias: string;
  lightning_pub_key: string;
  version_hash: string;
  network?: Network;
}

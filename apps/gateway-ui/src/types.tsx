interface Fees {
  base_msat: number;
  proportional_millionths: number;
}

export enum ModuleKind {
  Ln = 'ln',
  Mint = 'mint',
  Wallet = 'wallet',
}

interface FedimintModule {
  config: string;
  kind: ModuleKind;
  version: number;
}

interface ApiEndpoint {
  name: string;
  url: string;
}

export type MetaConfig = { federation_name?: string };

export interface ClientConfig {
  consensus_version: number;
  epoch_pk: string;
  federation_id: string;
  api_endpoints: Record<number, ApiEndpoint>;
  modules: Record<number, FedimintModule>;
  meta: MetaConfig;
}

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
}

export type TransactionId = string;

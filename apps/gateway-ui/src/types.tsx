interface Fees {
  base_msat: number;
  proportional_millionths: number;
}

export interface Federation {
  federation_id: string;
  balance_msat: number;
}

export interface GatewayInfo {
  federations: Federation[];
  fees: Fees;
  lightning_alias: string;
  lightning_pub_key: string;
  version_hash: string;
}

export type TransactionId = string;

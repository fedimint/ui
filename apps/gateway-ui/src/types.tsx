export interface Fees {
  base_msat: number;
  proportional_millionths: number;
}
export interface Registration {
  gateway_pub_key: string;
  api: string;
  fees: Fees;
  mint_channel_id: number;
  node_pub_key: string;
  route_hints: object[]; // FIXME
  valid_until: object; // FIXME
}

export interface Federation {
  federation_id: string;
  registration: Registration;
  balance_msat: number;
  lightning_alias: string;
  version_hash: string;
  lightning_pub_key: string;
}

export interface GatewayInfo {
  federations: Federation[];
  fees: {
    base_msat: number;
    proportional_millionths: number;
  };
  lightning_alias: string;
  lightning_pub_key: string;
  version_hash: string;
}

export type TransactionId = string;

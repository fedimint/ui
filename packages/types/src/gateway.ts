import { Network } from './bitcoin';
import { ClientConfig } from './federation';

export interface Gateway {
  api: string;
  fees: Fees;
  gateway_id: string;
  gateway_redeem_key: string;
  mint_channel_id: number;
  node_pub_key: string;
  route_hints: RouteHint[];
  valid_until: Validity;
}

export interface RouteHint {
  base_msat: number;
  proportional_millionths: number;
  cltv_expiry_delta: number;
  htlc_maximum_msat: number;
  htlc_minimum_msat: number;
  short_channel_id: string;
  src_node_id: string;
}

export interface Fees {
  base_msat: number;
  proportional_millionths: number;
}

interface Validity {
  nanos_since_epoch: number;
  secs_since_epoch: number;
}

export interface Federation {
  federation_id: string;
  balance_msat: number;
  channel_id: number;
  config: ClientConfig;
}

export interface GatewayInfo {
  federations: Federation[];
  fees: Fees;
  gateway_id: string;
  gateway_state: string;
  lightning_alias: string;
  lightning_pub_key: string;
  network?: Network;
  route_hints: RouteHint[];
  version_hash: string;
}

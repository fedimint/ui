import { Network } from './bitcoin';
import { GatewayClientConfig } from './federation';

export interface LightningGateway {
  mint_channel_id: number;
  gateway_redeem_key: string;
  node_pub_key: string;
  lightning_alias: string;
  api: string;
  route_hints: RouteHint[];
  fees: RoutingFees;
  gateway_id: string;
  supports_private_payments: boolean;
}

export type RouteHint = RouteHintHop[];

export interface RouteHintHop {
  src_node_id: string;
  short_channel_id: string;
  base_msat: number;
  proportional_millionths: number;
  cltv_expiry_delta: number;
  htlc_minimum_msat?: number;
  htlc_maximum_msat?: number;
}

export interface RoutingFees {
  base_msat: number;
  proportional_millionths: number;
}

export interface FederationInfo {
  federation_id: string;
  balance_msat: number;
  config: GatewayClientConfig;
  channel_id?: number;
  routing_fees?: RoutingFees;
}

export interface GatewayInfo {
  version_hash: string;
  federations: FederationInfo[];
  lightning_pub_key: string;
  lightning_alias: string;
  fees: RoutingFees;
  route_hints: RouteHint[];
  gateway_id: string;
  gateway_state: string;
  network?: Network;
  block_height?: number;
  synced_to_chain: boolean;
}

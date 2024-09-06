import { Network, MSats, Sats } from './bitcoin';

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

export interface FederationInfo {
  federation_id: string;
  balance_msat: number;
  channel_id: number;
  routing_fees: {
    base_msat: number;
    proportional_millionths: number;
  };
  config: JsonClientConfig;
}

export interface CreateBolt11InvoiceV2Payload {
  federation_id: string;
  contract: IncomingContract;
  invoice_amount: number;
  description: Bolt11InvoiceDescription;
  expiry_time: number;
}

export interface IncomingContract {
  commitment: string;
  ciphertext: string;
}

export type Bolt11InvoiceDescription =
  | { type: 'Direct'; value: string }
  | { type: 'Hash'; value: string };

export interface GatewayInfo {
  api: string;
  block_height: number;
  federation_fake_scids: Record<number, string>;
  federations: FederationInfo[];
  gateway_id: string;
  gateway_state: GatewayState;
  lightning_alias: string;
  lightning_mode: LightningMode;
  lightning_pub_key: string;
  network: Network;
  synced_to_chain: boolean;
  version_hash: string;
}

export enum GatewayState {
  Initializing = 'Initializing',
  Configuring = 'Configuring',
  Connected = 'Connected',
  Running = 'Running',
  Disconnected = 'Disconnected',
}

export enum LightningConfig {
  Lnd = 'lnd',
  Cln = 'cln',
  Ldk = 'ldk',
}

export interface LndConfig {
  lnd_rpc_addr: string;
  lnd_tls_cert: string;
  lnd_macaroon: string;
}

export interface ClnConfig {
  cln_extension_addr: string;
}

export interface LdkConfig {
  esplora_server_url: string;
  network: Network;
  lightning_port: number;
}

export type LightningMode =
  | { mode: LightningConfig.Lnd; config: LndConfig }
  | { mode: LightningConfig.Cln; config: ClnConfig }
  | { mode: LightningConfig.Ldk; config: LdkConfig };

export interface GatewayFedConfig {
  federations: Record<string, JsonClientConfig>;
}

export interface JsonClientConfig {
  global: GlobalClientConfig;
  modules: Record<string, JsonWithKind>;
}

export interface GlobalClientConfig {
  api_endpoints: Record<number, string>;
  broadcast_public_keys?: Record<number, string>;
  consensus_version: string;
  meta: Record<string, string>;
}

export interface JsonWithKind {
  kind: string;
  [key: string]: unknown;
}

export interface ChannelInfo {
  remote_pubkey: string;
  channel_size_sats: number;
  outbound_liquidity_sats: number;
  inbound_liquidity_sats: number;
  short_channel_id: number;
}

export interface OpenChannelPayload {
  pubkey: string;
  host: string;
  channel_size_sats: number;
  push_amount_sats: number;
}

export interface RoutingInfo {
  public_key: string;
  send_fee_minimum: PaymentFee;
  send_fee_default: PaymentFee;
  receive_fee: PaymentFee;
  expiration_delta_default: number;
  expiration_delta_minimum: number;
}

export interface PaymentFee {
  base: number;
  parts_per_million: number;
}

export interface PayInvoicePayload {
  federation_id: string;
  contract_id: string;
  payment_data: PaymentData;
  preimage_auth: string;
}

export type PaymentData =
  | { type: 'invoice'; value: Bolt11Invoice }
  | { type: 'pruned_invoice'; value: PrunedInvoice };

export interface Bolt11Invoice {
  signed_invoice: string;
}

export interface PrunedInvoice {
  amount: MSats;
  destination: string;
  destination_features: string;
  payment_hash: string;
  payment_secret: string;
  route_hints: RouteHint[];
  min_final_cltv_delta: number;
  expiry_timestamp: number;
}

export interface SendPaymentV2Payload {
  federation_id: string;
  contract: OutgoingContract;
  invoice: string;
  auth: string;
}

export interface OutgoingContract {
  payment_hash: string;
  amount: MSats;
  expiration: number;
  claim_pk: string;
  refund_pk: string;
  ephemeral_pk: string;
}

export interface SetConfigurationPayload {
  password?: string;
  num_route_hints?: number;
  routing_fees?: FederationRoutingFees;
  network?: Network;
  per_federation_routing_fees?: [string, FederationRoutingFees][];
}

export interface FederationRoutingFees {
  base_msat: MSats;
  proportional_millionths: number;
}

export interface PegOutPayload {
  federationId: string;
  satAmountOrAll: Sats | 'all';
  address: string;
}

export interface SpendEcashResponse {
  notes: string;
  operation_id: string;
}

export interface ReceiveEcashResponse {
  amount: number;
}

export interface GatewayBalances {
  onchain_balance_sats: number;
  lightning_balance_msats: number;
  ecash_balances: FederationBalanceInfo[];
}

export interface FederationBalanceInfo {
  federation_id: string;
  ecash_balance_msats: number;
}

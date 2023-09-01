import type { MSats } from '@fedimint/utils';

export enum ServerStatus {
  AwaitingPassword = 'AwaitingPassword',
  SharingConfigGenParams = 'SharingConfigGenParams',
  ReadyForConfigGen = 'ReadyForConfigGen',
  ConfigGenFailed = 'ConfigGenFailed',
  VerifyingConfigs = 'VerifyingConfigs',
  VerifiedConfigs = 'VerifiedConfigs',
  Upgrading = 'Upgrading',
  ConsensusRunning = 'ConsensusRunning',
}

export enum PeerConnectionStatus {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}

export interface PeerStatus {
  last_contribution?: number;
  connection_status: PeerConnectionStatus;
  flagged: boolean;
}

export interface Peer {
  name: string;
  cert: string;
  api_url: string;
  p2p_url: string;
  status: ServerStatus;
}

export interface FederationStatus {
  session_count: number;
  peers_online: number;
  peers_offline: number;
  peers_flagged: number;
  status_by_peer: Record<string, PeerStatus>;
}

export interface StatusResponse {
  server: ServerStatus;
  federation?: FederationStatus;
}

export interface Versions {
  core: {
    core_consensus: number;
    api: { major: number; minor: number }[];
  };
  modules: Record<
    number,
    {
      core_consensus: number;
      module_consensus: number;
      api: { major: number; minor: number }[];
    }
  >;
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

export interface ConfigResponse {
  client_config: ClientConfig;
}

interface Validity {
  nanos_since_epoch: number;
  secs_since_epoch: number;
}

export interface Fees {
  base_msat: number;
  proportional_millionths: number;
}

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

interface RouteHint {
  base_msat: number;
  proportional_millionths: number;
  cltv_expiry_delta: number;
  htlc_maximum_msat: number;
  htlc_minimum_msat: number;
  short_channel_id: string;
  src_node_id: string;
}

export enum Network {
  Testnet = 'testnet',
  Mainnet = 'bitcoin',
  Regtest = 'regtest',
  Signet = 'signet',
}

export interface BitcoinRpc {
  kind: string;
  url: string;
}

export interface ModuleSummary {
  net_assets: MSats;
}

export interface AuditSummary {
  net_assets: MSats;
  module_summaries: Record<string, ModuleSummary | undefined>;
}

// Consider sharing these types with types/setup.ts *ModuleParams? Need to
// confirm that setup API returns identical types to the admin API.
interface ModuleConfigs {
  [ModuleKind.Ln]: {
    network: Network;
    fee_consensus: {
      contract_input: number;
      contract_output: number;
    };
  };
  [ModuleKind.Mint]: {
    fee_consensus: {
      note_issuance_abs: number;
      note_spend_abs: number;
    };
    max_notes_per_denomination: number;
    peer_tbs_pks: Record<number, Record<number, string>>;
  };
  [ModuleKind.Wallet]: {
    client_default_bitcoin_rpc: BitcoinRpc;
    default_fee: { sats_per_kvb: number };
    fee_consensus: {
      peg_in_abs: number;
      peg_out_abs: number;
    };
    finality_delay: number;
    network: Network;
    peer_peg_in_keys: Record<number, { key: string }>;
    peg_in_descriptor: number;
  };
}

export type ModuleConfig<T extends ModuleKind = ModuleKind> = {
  kind: T;
} & ModuleConfigs[T];

export type ModulesConfigResponse = Record<string, ModuleConfig>;

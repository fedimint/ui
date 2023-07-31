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
  last_contribution_timestamp_seconds?: number;
  connection_status: PeerConnectionStatus;
  flagged: boolean;
}

export interface ConsensusStatus {
  last_contribution: number;
  peers_online: number;
  peers_offline: number;
  peers_flagged: number;
  status_by_peer: Record<string, PeerStatus>;
}

export interface StatusResponse {
  server: ServerStatus;
  consensus?: ConsensusStatus;
}

export interface Versions {
  core: {
    consensus: number;
    api: { major: number; minor: number }[];
  };
  modules: Record<
    number,
    {
      core: number;
      module: number;
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
  consenus_version: number;
  epoch_pk: string;
  federation_id: string;
  api_endpoint: Record<number, ApiEndpoint>;
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

export enum Status {
  Loading,
  Setup,
  Admin,
}

export interface AppState {
  status: Status;
  needsAuth: boolean;
  initServerStatus?: ServerStatus;
  appError?: string;
}

export enum APP_ACTION_TYPE {
  SET_STATUS = 'SET_STATUS',
  SET_NEEDS_AUTH = 'SET_NEEDS_AUTH',
  SET_INIT_SERVER_STATUS = 'SET_INIT_SERVER_STATUS',
  SET_ERROR = 'SET_ERROR',
}

export type AppAction =
  | {
      type: APP_ACTION_TYPE.SET_STATUS;
      payload: Status;
    }
  | {
      type: APP_ACTION_TYPE.SET_NEEDS_AUTH;
      payload: boolean;
    }
  | {
      type: APP_ACTION_TYPE.SET_INIT_SERVER_STATUS;
      payload: ServerStatus | undefined;
    }
  | {
      type: APP_ACTION_TYPE.SET_ERROR;
      payload: string | undefined;
    };

export interface InitializationState {
  needsAuth: boolean;
  serverStatus: ServerStatus;
}

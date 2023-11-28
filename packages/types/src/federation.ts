import type { MSats } from './bitcoin';
import {
  AnyModuleParams,
  FedimintModule,
  ModuleConfig,
  ModuleKind,
} from './modules';

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
  last_contribution: number;
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

export type PeerHashMap = Record<number, string>;

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
    core_consensus: CoreConsensusVersion;
    api: CoreApiVersion[];
  };
  modules: Record<
    number,
    {
      core_consensus: CoreConsensusVersion;
      module_consensus: ModuleConsensusVersion;
      api: ModuleApiVersion[];
    }
  >;
}

interface ApiEndpoint {
  name: string;
  url: string;
}

export type MetaConfig = { federation_name?: string } & Record<
  string,
  string | undefined
>;

type MajorAndMinorVersions = {
  major: number;
  minor: number;
};
export type CoreConsensusVersion = MajorAndMinorVersions;
export type CoreApiVersion = MajorAndMinorVersions;
export type ModuleConsensusVersion = MajorAndMinorVersions;
export type ModuleApiVersion = MajorAndMinorVersions;

export interface ClientConfig {
  consensus_version: CoreConsensusVersion;
  epoch_pk: string;
  federation_id: string;
  api_endpoints: Record<number, ApiEndpoint>;
  modules: Record<number, FedimintModule>;
  meta: MetaConfig;
}

export interface ModuleSummary {
  net_assets: MSats;
  kind: ModuleKind;
}

export interface AuditSummary {
  net_assets: MSats;
  module_summaries: Record<number, ModuleSummary>;
}

export type ModulesConfigResponse = Record<string, ModuleConfig>;

export type ConfigGenParams = {
  meta: MetaConfig;
  modules: Record<number, AnyModuleParams>;
};

export type ConsensusParams = ConfigGenParams & {
  peers: Record<number, Peer>;
};

export interface ConsensusState {
  consensus: ConsensusParams;
  our_current_id: number;
}

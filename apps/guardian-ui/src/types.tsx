export enum ServerStatus {
  AwaitingPassword = 'AwaitingPassword',
  SharingConfigGenParams = 'SharingConfigGenParams',
  ReadyForConfigGen = 'ReadyForConfigGen',
  ConfigGenFailed = 'ConfigGenFailed',
  VerifyingConfigs = 'VerifyingConfigs',
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
  consensus: ConsensusStatus;
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

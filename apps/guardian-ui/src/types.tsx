import { Peer, ServerStatus, ConfigGenParams } from '@fedimint/types';

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

export enum GuardianRole {
  Host = 'Host',
  Follower = 'Follower',
  Solo = 'Solo',
}

export enum SetupProgress {
  Start = 'Start',
  SetConfiguration = 'SetConfiguration',
  ConnectGuardians = 'ConnectGuardians',
  RunDKG = 'RunDKG',
  VerifyGuardians = 'VerifyGuardians',
  SetupComplete = 'SetupComplete',
}

export enum StepState {
  Active = 'Active',
  InActive = 'InActive',
  Completed = 'Completed',
}

export interface tosConfigState {
  showTos: boolean;
  tos: string | undefined;
}

export interface SetupState {
  role: GuardianRole | null;
  progress: SetupProgress;
  myName: string;
  password: string;
  ourCurrentId: number | null;
  configGenParams: ConfigGenParams | null;
  numPeers: number;
  peers: Peer[];
  tosConfig: tosConfigState;
}

export enum SETUP_ACTION_TYPE {
  SET_INITIAL_STATE = 'SET_INITIAL_STATE',
  SET_ROLE = 'SET_ROLE',
  SET_PROGRESS = 'SET_PROGRESS',
  SET_MY_NAME = 'SET_MY_NAME',
  SET_PASSWORD = 'SET_PASSWORD',
  SET_CONFIG_GEN_PARAMS = 'SET_CONFIG_GEN_PARAMS',
  SET_NUM_PEERS = 'SET_NUM_PEERS',
  SET_PEERS = 'SET_PEERS',
  SET_IS_SETUP_COMPLETE = 'SET_IS_SETUP_COMPLETE',
  SET_OUR_CURRENT_ID = 'SET_OUR_CURRENT_ID',
  SET_TOS_CONFIG = 'SET_TOS_CONFIG',
}

export type SetupAction =
  | {
      type: SETUP_ACTION_TYPE.SET_INITIAL_STATE;
      payload: null;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_ROLE;
      payload: GuardianRole;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_PROGRESS;
      payload: SetupProgress;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_MY_NAME;
      payload: string;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_CONFIG_GEN_PARAMS;
      payload: ConfigGenParams | null;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_PASSWORD;
      payload: string;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_NUM_PEERS;
      payload: number;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_PEERS;
      payload: Peer[];
    }
  | {
      type: SETUP_ACTION_TYPE.SET_IS_SETUP_COMPLETE;
      payload: boolean;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_TOS_CONFIG;
      payload: tosConfigState;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_OUR_CURRENT_ID;
      payload: number;
    };

// Setup RPC methods (only exist during setup)
export enum SetupRpc {
  setPassword = 'set_password',
  setConfigGenConnections = 'set_config_gen_connections',
  getDefaultConfigGenParams = 'default_config_gen_params',
  getConsensusConfigGenParams = 'consensus_config_gen_params',
  setConfigGenParams = 'set_config_gen_params',
  runDkg = 'run_dkg',
  verifiedConfigs = 'verified_configs',
  startConsensus = 'start_consensus',
  restartSetup = 'restart_federation_setup',
}

// Admin RPC methods (only exist after run_consensus)
export enum AdminRpc {
  version = 'version',
  fetchBlockCount = 'block_count',
  federationStatus = 'status',
  inviteCode = 'invite_code',
  config = 'client_config',
  modulesConfig = 'modules_config_json',
  moduleApiCall = 'module',
  audit = 'audit',
  downloadGuardianBackup = 'download_guardian_backup',
  federationId = 'federation_id',
}

export enum SharedRpc {
  auth = 'auth',
  status = 'status',
  getVerifyConfigHash = 'verify_config_hash',
}

export enum ModuleRpc {
  listGateways = 'list_gateways',
  blockCount = 'block_count',
}

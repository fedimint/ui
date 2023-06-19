import { ServerStatus } from '../types';

export enum GuardianRole {
  Host = 'Host',
  Follower = 'Follower',
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

export enum Network {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
  Regtest = 'regtest',
  Signet = 'signet',
}

export interface Peer {
  name: string;
  cert: string;
  api_url: string;
  p2p_url: string;
  status: ServerStatus;
}

export interface BitcoinRpc {
  kind: string;
  url: string;
}

export type PeerHashMap = Record<number, string>;

export type LnFedimintModule = [
  'ln',
  {
    consensus?: object;
    local?: object;
  }
];
export type MintFedimintModule = [
  'mint',
  {
    consensus?: { mint_amounts: number[] };
    local?: object;
  }
];
export type WalletFedimintModule = [
  'wallet',
  {
    consensus?: { finality_delay: number; network: Network };
    local?: {
      bitcoin_rpc: BitcoinRpc;
    };
  }
];
export type OtherFedimintModule = [string, object];
export type AnyFedimintModule =
  | LnFedimintModule
  | MintFedimintModule
  | WalletFedimintModule
  | OtherFedimintModule;

type Meta = { federation_name?: string };

type Modules = Record<number, AnyFedimintModule>;

export type ConfigGenParams = {
  meta: Meta;
  modules: Modules;
};

type ConsensusParams = ConfigGenParams & {
  peers: Record<number, Peer>;
};

export interface ConsensusState {
  consensus: ConsensusParams;
  our_current_id: number;
}

export interface SetupState {
  isInitializing: boolean;
  role: GuardianRole | null;
  progress: SetupProgress;
  myName: string;
  password: string;
  ourCurrentId: number | null;
  configGenParams: ConfigGenParams | null;
  numPeers: number;
  needsAuth: boolean;
  peers: Peer[];
}

export enum SETUP_ACTION_TYPE {
  SET_IS_INITIALIZING = 'SET_IS_INITIALIZING',
  SET_INITIAL_STATE = 'SET_INITIAL_STATE',
  SET_ROLE = 'SET_ROLE',
  SET_PROGRESS = 'SET_PROGRESS',
  SET_MY_NAME = 'SET_MY_NAME',
  SET_PASSWORD = 'SET_PASSWORD',
  SET_NEEDS_AUTH = 'SET_NEEDS_AUTH',
  SET_CONFIG_GEN_PARAMS = 'SET_CONFIG_GEN_PARAMS',
  SET_NUM_PEERS = 'SET_NUM_PEERS',
  SET_PEERS = 'SET_PEERS',
  SET_IS_SETUP_COMPLETE = 'SET_IS_SETUP_COMPLETE',
  SET_OUR_CURRENT_ID = 'SET_OUR_CURRENT_ID',
}

export type SetupAction =
  | {
      type: SETUP_ACTION_TYPE.SET_INITIAL_STATE;
      payload: null;
    }
  | {
      type: SETUP_ACTION_TYPE.SET_IS_INITIALIZING;
      payload: boolean;
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
      type: SETUP_ACTION_TYPE.SET_NEEDS_AUTH;
      payload: boolean;
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
      type: SETUP_ACTION_TYPE.SET_OUR_CURRENT_ID;
      payload: number;
    };

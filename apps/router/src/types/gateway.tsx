import { FederationInfo, GatewayBalances, GatewayInfo } from '@fedimint/types';
import { Unit } from './index';

export type GatewayConfig = {
  id: string;
  baseUrl: string;
};

export enum GatewayStatus {
  Loading,
  Initializing,
  Configuring,
  Connected,
  Running,
  Disconnected,
}

export enum WalletModalAction {
  Receive = 'receive',
  Send = 'send',
}
export enum WalletModalType {
  Ecash = 'ecash',
  // Lightning = 'lightning',
  Onchain = 'onchain',
}

export interface WalletModalState {
  isOpen: boolean;
  action: WalletModalAction;
  type: WalletModalType;
  selectedFederation: FederationInfo | null;
}

export interface GatewayAppState {
  status: GatewayStatus;
  needsAuth: boolean;
  gatewayError: string | undefined;
  balances: GatewayBalances | null;
  gatewayInfo: GatewayInfo | null;
  unit: Unit;
  showConnectFed: boolean;
  walletModalState: WalletModalState;
  activeTab: number;
}

export enum GATEWAY_APP_ACTION_TYPE {
  SET_STATUS = 'SET_STATUS',
  SET_NEEDS_AUTH = 'SET_NEEDS_AUTH',
  SET_ERROR = 'SET_ERROR',
  SET_BALANCES = 'SET_BALANCES',
  SET_GATEWAY_INFO = 'SET_GATEWAY_INFO',
  SET_UNIT = 'SET_UNIT',
  SET_SHOW_CONNECT_FED = 'SET_SHOW_CONNECT_FED',
  SET_WALLET_MODAL_STATE = 'SET_WALLET_MODAL_STATE',
  SET_ACTIVE_TAB = 'SET_ACTIVE_TAB',
}

export type GatewayAppAction =
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_STATUS;
      payload: GatewayStatus;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_NEEDS_AUTH;
      payload: boolean;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_ERROR;
      payload: string;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_BALANCES;
      payload: GatewayBalances;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_GATEWAY_INFO;
      payload: GatewayInfo;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_UNIT;
      payload: Unit;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_SHOW_CONNECT_FED;
      payload: boolean;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE;
      payload: WalletModalState;
    }
  | {
      type: GATEWAY_APP_ACTION_TYPE.SET_ACTIVE_TAB;
      payload: number;
    };

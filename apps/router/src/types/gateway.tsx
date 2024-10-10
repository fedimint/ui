import { GatewayBalances, GatewayInfo } from '@fedimint/types';
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

export interface GatewayAppState {
  status: GatewayStatus;
  needsAuth: boolean;
  gatewayError: string | undefined;
  balances: GatewayBalances | null;
  gatewayInfo: GatewayInfo | null;
  unit: Unit;
}

export enum GATEWAY_APP_ACTION_TYPE {
  SET_STATUS = 'SET_STATUS',
  SET_NEEDS_AUTH = 'SET_NEEDS_AUTH',
  SET_ERROR = 'SET_ERROR',
  SET_BALANCES = 'SET_BALANCES',
  SET_GATEWAY_INFO = 'SET_GATEWAY_INFO',
  SET_UNIT = 'SET_UNIT',
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
    };

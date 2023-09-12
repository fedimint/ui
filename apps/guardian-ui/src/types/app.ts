import { ServerStatus } from './api';

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

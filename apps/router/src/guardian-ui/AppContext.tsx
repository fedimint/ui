import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import { GuardianServerStatus } from '@fedimint/types';
import { GuardianApi } from './GuardianApi';
import { formatApiErrorMessage } from './utils/api';
import {
  GUARDIAN_APP_ACTION_TYPE,
  GuardianAppAction,
  GuardianAppState,
  GuardianStatus,
} from './types';

export interface GuardianAppContextValue {
  api: GuardianApi;
  state: GuardianAppState;
  dispatch: Dispatch<GuardianAppAction>;
}

const initialState = {
  status: GuardianStatus.Loading,
  needsAuth: false,
  initServerStatus: undefined,
  appError: undefined,
};

const reducer = (
  state: GuardianAppState,
  action: GuardianAppAction
): GuardianAppState => {
  switch (action.type) {
    case GUARDIAN_APP_ACTION_TYPE.SET_STATUS:
      return { ...state, status: action.payload };
    case GUARDIAN_APP_ACTION_TYPE.SET_NEEDS_AUTH:
      return { ...state, needsAuth: action.payload };
    case GUARDIAN_APP_ACTION_TYPE.SET_INIT_SERVER_STATUS:
      return { ...state, initServerStatus: action.payload };
    case GUARDIAN_APP_ACTION_TYPE.SET_ERROR:
      return { ...state, appError: action.payload };
    default:
      return state;
  }
};

const api = new GuardianApi();

export const GuardianAppContext = createContext<GuardianAppContextValue>({
  api: api,
  state: initialState,
  dispatch: () => null,
});

export interface GuardianAppContextProviderProps {
  children: ReactNode;
}

export const GuardianAppContextProvider: React.FC<
  GuardianAppContextProviderProps
> = ({ children }: GuardianAppContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const guardianConfig = await api.getGuardianConfig();
        if (!guardianConfig?.fm_config_api) {
          dispatch({
            type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
            payload: GuardianStatus.NotConfigured,
          });
          return;
        }
        await api.connect(guardianConfig.fm_config_api);
        const server = (await api.status()).server;

        // If they're at a point where a password has been configured, make
        // sure they have a valid password set. If not, set needsAuth.
        if (server !== GuardianServerStatus.AwaitingPassword) {
          const password = api.getPassword();
          const hasValidPassword = password
            ? await api.testPassword(password)
            : false;
          if (!hasValidPassword) {
            dispatch({
              type: GUARDIAN_APP_ACTION_TYPE.SET_NEEDS_AUTH,
              payload: true,
            });
          }
        }

        if (server === GuardianServerStatus.ConsensusRunning) {
          dispatch({
            type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
            payload: GuardianStatus.Admin,
          });
        } else {
          dispatch({
            type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
            payload: GuardianStatus.Setup,
          });
        }

        dispatch({
          type: GUARDIAN_APP_ACTION_TYPE.SET_INIT_SERVER_STATUS,
          payload: server,
        });
      } catch (err) {
        console.log('app error', err);
        dispatch({
          type: GUARDIAN_APP_ACTION_TYPE.SET_ERROR,
          payload: formatApiErrorMessage(err),
        });
      }
    };

    if (state.status === GuardianStatus.Loading) {
      load().catch((err) => console.error(err));
    }
  }, [state.status]);

  return (
    <GuardianAppContext.Provider
      value={{
        api,
        state,
        dispatch,
      }}
    >
      {children}
    </GuardianAppContext.Provider>
  );
};

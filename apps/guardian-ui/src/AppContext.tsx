import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import { ServerStatus } from '@fedimint/types';
import { GuardianApi } from './GuardianApi';
import { formatApiErrorMessage } from './utils/api';
import { APP_ACTION_TYPE, AppAction, AppState, Status } from './types';

export interface AppContextValue {
  api: GuardianApi;
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const initialState = {
  status: Status.Loading,
  needsAuth: false,
  initServerStatus: undefined,
  appError: undefined,
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case APP_ACTION_TYPE.SET_STATUS:
      return { ...state, status: action.payload };
    case APP_ACTION_TYPE.SET_NEEDS_AUTH:
      return { ...state, needsAuth: action.payload };
    case APP_ACTION_TYPE.SET_INIT_SERVER_STATUS:
      return { ...state, initServerStatus: action.payload };
    case APP_ACTION_TYPE.SET_ERROR:
      return { ...state, appError: action.payload };
    default:
      return state;
  }
};

const api = new GuardianApi();

export const AppContext = createContext<AppContextValue>({
  api: api,
  state: initialState,
  dispatch: () => null,
});

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const guardianConfig = await api.getGuardianConfig();
        if (!guardianConfig?.fm_config_api) {
          dispatch({
            type: APP_ACTION_TYPE.SET_STATUS,
            payload: Status.NotConfigured,
          });
          return;
        }
        await api.connect(guardianConfig.fm_config_api);
        const server = (await api.status()).server;

        // If they're at a point where a password has been configured, make
        // sure they have a valid password set. If not, set needsAuth.
        if (server !== ServerStatus.AwaitingPassword) {
          const password = api.getPassword();
          const hasValidPassword = password
            ? await api.testPassword(password)
            : false;
          if (!hasValidPassword) {
            dispatch({ type: APP_ACTION_TYPE.SET_NEEDS_AUTH, payload: true });
          }
        }

        if (server === ServerStatus.ConsensusRunning) {
          dispatch({ type: APP_ACTION_TYPE.SET_STATUS, payload: Status.Admin });
        } else {
          dispatch({ type: APP_ACTION_TYPE.SET_STATUS, payload: Status.Setup });
        }

        dispatch({
          type: APP_ACTION_TYPE.SET_INIT_SERVER_STATUS,
          payload: server,
        });
      } catch (err) {
        dispatch({
          type: APP_ACTION_TYPE.SET_ERROR,
          payload: formatApiErrorMessage(err),
        });
      }
    };

    if (state.status === Status.Loading) {
      load().catch((err) => console.error(err));
    }
  }, [state.status]);

  return (
    <AppContext.Provider
      value={{
        api,
        state,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { GuardianApi } from './GuardianApi';
import { formatApiErrorMessage } from './utils/api';
import {
  APP_ACTION_TYPE,
  AppAction,
  AppState,
  ServerStatus,
  Status,
} from './types';

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

export const AppContext = createContext<AppContextValue>({
  api: new GuardianApi(),
  state: initialState,
  dispatch: () => null,
});

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const api = useMemo(() => new GuardianApi(), []);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        await api.connect();
        const server = (await api.status()).server;

        const password = api.getPassword();
        if (server !== ServerStatus.AwaitingPassword && !password) {
          dispatch({ type: APP_ACTION_TYPE.SET_NEEDS_AUTH, payload: true });
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

    // Shut down API on dismount
    return () => {
      api.shutdown();
    };
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

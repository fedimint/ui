import React, {
  createContext,
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
} from 'react';
import { GuardianApi } from '../../guardian-ui/GuardianApi';
import {
  GUARDIAN_APP_ACTION_TYPE,
  GuardianAppAction,
  GuardianAppState,
  GuardianStatus,
} from '../../guardian-ui/types';
import {
  useGuardianConfig,
  useLoadGuardian,
  useSelectedServiceId,
} from '../hooks';

export interface GuardianContextValue {
  id: string;
  api: GuardianApi;
  state: GuardianAppState;
  dispatch: Dispatch<GuardianAppAction>;
}

const initialState = {
  status: GuardianStatus.Loading,
  needsAuth: false,
  initServerStatus: undefined,
  guardianError: undefined,
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
      return { ...state, guardianError: action.payload };
    default:
      return state;
  }
};

export const GuardianContext = createContext<GuardianContextValue | null>(null);

export interface GuardianContextProviderProps {
  children: ReactNode;
}

export const GuardianContextProvider: React.FC<
  GuardianContextProviderProps
> = ({ children }) => {
  const selectedServiceId = useSelectedServiceId();
  const config = useGuardianConfig();
  const [state, dispatch] = useReducer(reducer, initialState);
  const guardianApi = useMemo(() => new GuardianApi(config), [config]);

  useLoadGuardian();

  return (
    <GuardianContext.Provider
      value={{
        id: selectedServiceId,
        api: guardianApi,
        state,
        dispatch,
      }}
    >
      {children}
    </GuardianContext.Provider>
  );
};

import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { GatewayApi } from './gateway-ui/GatewayApi';
import { GuardianApi } from './guardian-ui/GuardianApi';
import {
  GUARDIAN_APP_ACTION_TYPE,
  GuardianAppAction,
  GuardianAppState,
  GuardianStatus,
} from './guardian-ui/types';
import { GuardianServerStatus } from '@fedimint/types';
import { formatApiErrorMessage } from './guardian-ui/utils/api';

export interface Guardian {
  api: GuardianApi;
  state: GuardianAppState;
}

export interface Gateway {
  api: GatewayApi;
}

export interface AppContextValue {
  guardians: Guardian[];
  gateways: Gateway[];
  dispatch: (guardianIndex: number, action: GuardianAppAction) => void;
}

const initialState: AppContextValue = {
  guardians: [],
  gateways: [],
  dispatch: () => null,
};

const guardianReducer = (
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

export const AppContext = createContext<AppContextValue>(initialState);

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const [state, setState] = useState<AppContextValue>(initialState);

  const dispatch = (guardianIndex: number, action: GuardianAppAction) => {
    setState((prevState) => {
      const updatedGuardians = [...prevState.guardians];
      updatedGuardians[guardianIndex] = {
        ...updatedGuardians[guardianIndex],
        state: guardianReducer(updatedGuardians[guardianIndex].state, action),
      };
      return { ...prevState, guardians: updatedGuardians };
    });
  };

  useEffect(() => {
    state.guardians.forEach((guardian, index) => {
      const load = async () => {
        try {
          const guardianConfig = await guardian.api.getGuardianConfig();
          if (!guardianConfig?.fm_config_api) {
            dispatch(index, {
              type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
              payload: GuardianStatus.NotConfigured,
            });
            return;
          }
          await guardian.api.connect(guardianConfig.fm_config_api);
          const server = (await guardian.api.status()).server;

          if (server !== GuardianServerStatus.AwaitingPassword) {
            const password = guardian.api.getPassword();
            const hasValidPassword = password
              ? await guardian.api.testPassword(password)
              : false;
            if (!hasValidPassword) {
              dispatch(index, {
                type: GUARDIAN_APP_ACTION_TYPE.SET_NEEDS_AUTH,
                payload: true,
              });
            }
          }

          if (server === GuardianServerStatus.ConsensusRunning) {
            dispatch(index, {
              type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
              payload: GuardianStatus.Admin,
            });
          } else {
            dispatch(index, {
              type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
              payload: GuardianStatus.Setup,
            });
          }

          dispatch(index, {
            type: GUARDIAN_APP_ACTION_TYPE.SET_INIT_SERVER_STATUS,
            payload: server,
          });
        } catch (err) {
          dispatch(index, {
            type: GUARDIAN_APP_ACTION_TYPE.SET_ERROR,
            payload: formatApiErrorMessage(err),
          });
        }
      };

      if (guardian.state.status === GuardianStatus.Loading) {
        load().catch((err) => console.error(err));
      }
    });
  }, [state.guardians]);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

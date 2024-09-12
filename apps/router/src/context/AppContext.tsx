import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { GuardianConfig } from '../guardian-ui/GuardianApi';

import { GatewayConfig } from '../gateway-ui/types';

export interface Guardian {
  config: GuardianConfig;
}

export interface Gateway {
  config: GatewayConfig;
}

export interface AppContextValue {
  selectedService: {
    id: string;
    kind: 'guardian' | 'gateway';
  } | null;
  guardians: Record<string, Guardian>;
  gateways: Record<string, Gateway>;
  dispatch: Dispatch<AppAction>;
}

const makeInitialState = (): AppContextValue => {
  const storedState = localStorage.getItem('fedimint_ui_state');
  if (storedState) {
    try {
      const parsedState = JSON.parse(storedState);
      return {
        ...parsedState,
        dispatch: () => null,
      };
    } catch (error) {
      console.error('Failed to parse stored state:', error);
    }
  }
  return {
    selectedService: null,
    guardians: {},
    gateways: {},
    dispatch: () => null,
  };
};

export enum APP_ACTION_TYPE {
  SET_SELECTED_SERVICE = 'SET_SELECTED_SERVICE',
  ADD_GUARDIAN = 'ADD_GUARDIAN',
  ADD_GATEWAY = 'ADD_GATEWAY',
  REMOVE_GUARDIAN = 'REMOVE_GUARDIAN',
  REMOVE_GATEWAY = 'REMOVE_GATEWAY',
}

export type AppAction =
  | {
      type: APP_ACTION_TYPE.SET_SELECTED_SERVICE;
      payload: {
        id: string;
        kind: 'guardian' | 'gateway';
      };
    }
  | {
      type: APP_ACTION_TYPE.ADD_GUARDIAN;
      payload: {
        id: string;
        guardian: Guardian;
      };
    }
  | {
      type: APP_ACTION_TYPE.ADD_GATEWAY;
      payload: {
        id: string;
        gateway: Gateway;
      };
    }
  | {
      type: APP_ACTION_TYPE.REMOVE_GUARDIAN;
      payload: string;
    }
  | {
      type: APP_ACTION_TYPE.REMOVE_GATEWAY;
      payload: string;
    };

const reducer = (
  state: AppContextValue,
  action: AppAction
): AppContextValue => {
  switch (action.type) {
    case APP_ACTION_TYPE.SET_SELECTED_SERVICE:
      return {
        ...state,
        selectedService: action.payload,
      };
    case APP_ACTION_TYPE.ADD_GUARDIAN:
      return {
        ...state,
        guardians: {
          ...state.guardians,
          [action.payload.id]: action.payload.guardian,
        },
      };
    case APP_ACTION_TYPE.ADD_GATEWAY:
      return {
        ...state,
        gateways: {
          ...state.gateways,
          [action.payload.id]: action.payload.gateway,
        },
      };
    case APP_ACTION_TYPE.REMOVE_GUARDIAN:
      return {
        ...state,
        guardians: Object.fromEntries(
          Object.entries(state.guardians).filter(
            ([key]) => key !== action.payload
          )
        ),
      };
    case APP_ACTION_TYPE.REMOVE_GATEWAY:
      return {
        ...state,
        gateways: Object.fromEntries(
          Object.entries(state.gateways).filter(
            ([key]) => key !== action.payload
          )
        ),
      };
  }
};

export const AppContext = createContext<AppContextValue>(makeInitialState());

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, makeInitialState());

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

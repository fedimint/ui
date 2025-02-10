import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { GuardianConfig } from '../types/guardian';
import { GatewayConfig } from '../types/gateway';

export interface Guardian {
  config: GuardianConfig;
}

export interface Gateway {
  config: GatewayConfig;
}

export interface AppContextValue {
  guardians: Record<string, Guardian>;
  gateways: Record<string, Gateway>;
  dispatch: Dispatch<AppAction>;
}

export const initialState: AppContextValue = {
  guardians: {},
  gateways: {},
  dispatch: () => null,
};

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
  return initialState;
};

export enum APP_ACTION_TYPE {
  SET_SELECTED_SERVICE = 'SET_SELECTED_SERVICE',
  ADD_GUARDIAN = 'ADD_GUARDIAN',
  ADD_GATEWAY = 'ADD_GATEWAY',
  REMOVE_GUARDIAN = 'REMOVE_GUARDIAN',
  REMOVE_GATEWAY = 'REMOVE_GATEWAY',
  UPDATE_GUARDIAN = 'UPDATE_GUARDIAN',
  UPDATE_GATEWAY = 'UPDATE_GATEWAY',
}

export type AppAction =
  | {
      type: APP_ACTION_TYPE.ADD_GUARDIAN;
      payload: {
        id: string;
        service: Guardian;
      };
    }
  | {
      type: APP_ACTION_TYPE.ADD_GATEWAY;
      payload: {
        id: string;
        service: Gateway;
      };
    }
  | {
      type: APP_ACTION_TYPE.REMOVE_GUARDIAN;
      payload: string;
    }
  | {
      type: APP_ACTION_TYPE.REMOVE_GATEWAY;
      payload: string;
    }
  | {
      type: APP_ACTION_TYPE.UPDATE_GUARDIAN;
      payload: {
        id: string;
        service: Guardian;
      };
    }
  | {
      type: APP_ACTION_TYPE.UPDATE_GATEWAY;
      payload: {
        id: string;
        service: Gateway;
      };
    };

const saveToLocalStorage = (state: AppContextValue) => {
  localStorage.setItem('fedimint_ui_state', JSON.stringify(state));
};

const reducer = (
  state: AppContextValue,
  action: AppAction
): AppContextValue => {
  switch (action.type) {
    case APP_ACTION_TYPE.ADD_GUARDIAN:
      return {
        ...state,
        guardians: {
          ...state.guardians,
          [action.payload.id]: action.payload.service,
        },
      };
    case APP_ACTION_TYPE.ADD_GATEWAY:
      return {
        ...state,
        gateways: {
          ...state.gateways,
          [action.payload.id]: action.payload.service,
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
    case APP_ACTION_TYPE.UPDATE_GUARDIAN:
      return {
        ...state,
        guardians: {
          ...state.guardians,
          [action.payload.id]: action.payload.service,
        },
      };
    case APP_ACTION_TYPE.UPDATE_GATEWAY:
      return {
        ...state,
        gateways: {
          ...state.gateways,
          [action.payload.id]: action.payload.service,
        },
      };
  }
};

const reducerWithMiddleware = (
  state: AppContextValue,
  action: AppAction
): AppContextValue => {
  const newState = reducer(state, action);
  saveToLocalStorage(newState);
  return newState;
};

export const AppContext = createContext<AppContextValue>(makeInitialState());

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const [state, dispatch] = useReducer(
    reducerWithMiddleware,
    makeInitialState()
  );

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

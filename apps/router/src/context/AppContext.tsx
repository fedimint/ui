import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import { GuardianConfig } from '../types/guardian';
import { GatewayConfig } from '../types/gateway';
import { sha256Hash } from '@fedimint/utils';

interface ServiceConfig {
  baseUrl: string;
}

export interface AppContextValue {
  guardians: Record<string, GuardianConfig>;
  gateways: Record<string, GatewayConfig>;
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
  UPDATE_GUARDIAN = 'UPDATE_GUARDIAN',
  UPDATE_GATEWAY = 'UPDATE_GATEWAY',
}

export type AppAction =
  | {
      type: APP_ACTION_TYPE.ADD_GUARDIAN;
      payload: {
        id: string;
        guardian: GuardianConfig;
      };
    }
  | {
      type: APP_ACTION_TYPE.ADD_GATEWAY;
      payload: {
        id: string;
        gateway: GatewayConfig;
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
        guardian: GuardianConfig;
      };
    }
  | {
      type: APP_ACTION_TYPE.UPDATE_GATEWAY;
      payload: {
        id: string;
        gateway: GatewayConfig;
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
    case APP_ACTION_TYPE.UPDATE_GUARDIAN:
      return {
        ...state,
        guardians: {
          ...state.guardians,
          [action.payload.id]: action.payload.guardian,
        },
      };
    case APP_ACTION_TYPE.UPDATE_GATEWAY:
      return {
        ...state,
        gateways: {
          ...state.gateways,
          [action.payload.id]: action.payload.gateway,
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

  useEffect(() => {
    const isGuardian = (service: ServiceConfig) =>
      service.baseUrl.startsWith('ws');
    const isGateway = (service: ServiceConfig) =>
      service.baseUrl.startsWith('http');
    const addService = async (service: ServiceConfig) => {
      const id = await sha256Hash(service.baseUrl);

      if (isGuardian(service)) {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: { id, guardian: { id, config: service } },
        });
      } else if (isGateway(service)) {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, gateway: { id, config: service } },
        });
      } else {
        throw new Error(`Invalid service baseUrl in config.json: ${service}`);
      }
    };

    const handleConfig = (data: ServiceConfig | ServiceConfig[]) => {
      const services = Array.isArray(data) ? data : [data];
      services.forEach((service) => {
        addService(service);
      });
    };

    fetch('/config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        if (!text.trim()) {
          console.warn('Config file is empty');
          return;
        }
        try {
          const data = JSON.parse(text);
          handleConfig(data);
        } catch (error) {
          console.error('Error parsing config JSON:', error);
          console.log('Raw config content:', text);
        }
      })
      .catch((error) => {
        console.error('Error fetching or processing config:', error);
      });
  }, []);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

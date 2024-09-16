import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import { GuardianConfig } from '../guardian-ui/GuardianApi';

import { GatewayConfig } from '../gateway-ui/types';
import { sha256Hash } from '@fedimint/utils';

type Service = GuardianConfig | GatewayConfig;

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
}

export type AppAction =
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

  useEffect(() => {
    const isGuardian = (service: Service): service is GuardianConfig =>
      service.baseUrl.startsWith('ws');
    const isGateway = (service: Service): service is GatewayConfig =>
      service.baseUrl.startsWith('http');
    const addService = async (service: Service) => {
      const id = await sha256Hash(service.baseUrl);

      if (isGuardian(service)) {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: { id, guardian: { config: service as GuardianConfig } },
        });
      } else if (isGateway(service)) {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, gateway: { config: service as GatewayConfig } },
        });
      } else {
        throw new Error(`Invalid service baseUrl in config.json: ${service}`);
      }
    };

    const handleConfig = (data: Service | Service[]) => {
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

  if (
    Object.keys(state.guardians).length === 0 &&
    Object.keys(state.gateways).length === 0
  ) {
    return null;
  }

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

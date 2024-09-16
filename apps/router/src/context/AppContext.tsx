import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import { GuardianConfig } from '../guardian-ui/GuardianApi';

import { GatewayConfig } from '../gateway-ui/types';

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
    const addService = (service: Service, index: number) => {
      const kind = isGuardian(service) ? 'guardian' : 'gateway';
      const id = (index + 1).toString();

      if (kind === 'guardian') {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: { id, guardian: { config: service as GuardianConfig } },
        });
      } else {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, gateway: { config: service as GatewayConfig } },
        });
      }
    };

    const isGuardian = (service: Service): service is GuardianConfig =>
      'fm_config_api' in service;
    const isGateway = (service: Service): service is GatewayConfig =>
      'baseUrl' in service;

    const handleConfig = (data: Service | Service[]) => {
      const services = Array.isArray(data) ? data : [data];
      services.forEach((service, index) => {
        if (isGuardian(service) || isGateway(service)) {
          addService(service, index);
        }
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

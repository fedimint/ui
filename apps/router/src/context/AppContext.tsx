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
  UPDATE_GUARDIAN = 'UPDATE_GUARDIAN',
  UPDATE_GATEWAY = 'UPDATE_GATEWAY',
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
    }
  | {
      type: APP_ACTION_TYPE.UPDATE_GUARDIAN;
      payload: {
        id: string;
        guardian: Guardian;
      };
    }
  | {
      type: APP_ACTION_TYPE.UPDATE_GATEWAY;
      payload: {
        id: string;
        gateway: Gateway;
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
    const isGuardian = (service: Service): service is GuardianConfig =>
      service.baseUrl.startsWith('ws');
    const isGateway = (service: Service): service is GatewayConfig =>
      service.baseUrl.startsWith('http');

    const addService = async (service: Service) => {
      const id = await sha256Hash(service.baseUrl);
      const newService = { ...service, id };

      if (isGuardian(newService)) {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: { id, guardian: { config: newService as GuardianConfig } },
        });
      } else if (isGateway(newService)) {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, gateway: { config: newService as GatewayConfig } },
        });
      } else {
        throw new Error(`Invalid service baseUrl: ${service.baseUrl}`);
      }
    };

    const handleConfig = (data: Service | Service[]) => {
      const services = Array.isArray(data) ? data : [data];
      services.forEach((service) => {
        addService(service);
      });
    };

    // Check environment variables
    const checkEnvVars = async () => {
      if (process.env.REACT_APP_FM_CONFIG_API) {
        const id = await sha256Hash(process.env.REACT_APP_FM_CONFIG_API);
        await addService({
          id,
          baseUrl: process.env.REACT_APP_FM_CONFIG_API,
        });
      }
      if (process.env.REACT_APP_FM_GATEWAY_API) {
        const id = await sha256Hash(process.env.REACT_APP_FM_GATEWAY_API);
        await addService({
          id,
          baseUrl: process.env.REACT_APP_FM_GATEWAY_API,
        });
      }
    };

    // Fetch config.json
    const fetchConfig = () => {
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
          }
        })
        .catch((error) => {
          console.error('Error fetching or processing config:', error);
        });
    };

    // Run both checks
    checkEnvVars().then(fetchConfig);
  }, []);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

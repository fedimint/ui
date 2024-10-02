import React, {
  createContext,
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
} from 'react';
import { useGatewayConfig } from '../hooks';
import {
  GATEWAY_APP_ACTION_TYPE,
  GatewayAppAction,
  GatewayAppState,
  GatewayStatus,
} from '../../types/gateway';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GatewayApi } from '../../api/GatewayApi';

export interface GatewayContextValue {
  id: string;
  api: GatewayApi;
  state: GatewayAppState;
  dispatch: Dispatch<GatewayAppAction>;
}

const initialState: GatewayAppState = {
  status: GatewayStatus.Loading,
  needsAuth: true,
  gatewayError: undefined,
  balances: null,
  gatewayInfo: null,
  unit: 'msats',
};

const reducer = (
  state: GatewayAppState,
  action: GatewayAppAction
): GatewayAppState => {
  switch (action.type) {
    case GATEWAY_APP_ACTION_TYPE.SET_STATUS:
      return { ...state, status: action.payload };
    case GATEWAY_APP_ACTION_TYPE.SET_NEEDS_AUTH:
      return { ...state, needsAuth: action.payload };
    case GATEWAY_APP_ACTION_TYPE.SET_ERROR:
      return { ...state, gatewayError: action.payload };
    case GATEWAY_APP_ACTION_TYPE.SET_BALANCES:
      return { ...state, balances: action.payload };
    case GATEWAY_APP_ACTION_TYPE.SET_GATEWAY_INFO:
      return { ...state, gatewayInfo: action.payload };
    case GATEWAY_APP_ACTION_TYPE.SET_UNIT:
      return { ...state, unit: action.payload };
    default:
      return state;
  }
};

export const GatewayContext = createContext<GatewayContextValue | null>(null);

export interface GatewayContextProviderProps {
  children: ReactNode;
}

export const GatewayContextProvider: React.FC<GatewayContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const gatewayId = location.pathname.split('/')[2];
  const { getGatewayPassword } = useAuth();
  const config = useGatewayConfig(gatewayId);
  const password = getGatewayPassword(gatewayId);
  console.log('password', password);
  const gatewayApi = useMemo(
    () => new GatewayApi(config, password),
    [config, password]
  );

  return (
    <GatewayContext.Provider
      value={{
        id: gatewayId,
        api: gatewayApi,
        state,
        dispatch,
      }}
    >
      {children}
    </GatewayContext.Provider>
  );
};

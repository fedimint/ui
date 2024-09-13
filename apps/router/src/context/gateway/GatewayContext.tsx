import React, {
  createContext,
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
} from 'react';
import {
  useGatewayConfig,
  useLoadGateway,
  useSelectedServiceId,
} from '../hooks';
import { GatewayApi } from '../../gateway-ui/GatewayApi';
import {
  GATEWAY_APP_ACTION_TYPE,
  GatewayAppAction,
  GatewayAppState,
  GatewayStatus,
} from '../../gateway-ui/types';
import { Loading } from '../../gateway-ui/components/Loading';
import { ErrorMessage } from '../../gateway-ui/components/ErrorMessage';
import { Login } from '@fedimint/ui';

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
  const selectedServiceId = useSelectedServiceId();
  const config = useGatewayConfig();
  const [state, dispatch] = useReducer(reducer, initialState);
  const gatewayApi = useMemo(() => new GatewayApi(config), [config]);

  const { isAuthenticated, runningInitialAuthCheck } = useLoadGateway(dispatch);

  if (runningInitialAuthCheck || state === null || state.gatewayInfo === null)
    return <Loading />;
  if (state.gatewayError) return <ErrorMessage error={state.gatewayError} />;
  if (!isAuthenticated) {
    return (
      <Login
        checkAuth={gatewayApi.testPassword}
        setAuthenticated={() =>
          dispatch({
            type: GATEWAY_APP_ACTION_TYPE.SET_NEEDS_AUTH,
            payload: false,
          })
        }
        parseError={(err) => (err as Error).message}
      />
    );
  }

  return (
    <GatewayContext.Provider
      value={{
        id: selectedServiceId,
        api: gatewayApi,
        state,
        dispatch,
      }}
    >
      {children}
    </GatewayContext.Provider>
  );
};

import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';

export interface AuthContextValue {
  guardianPasswords: Record<string, string>;
  gatewayPasswords: Record<string, string>;
  dispatch: Dispatch<AuthAction>;
}

const makeInitialState = (): AuthContextValue => {
  const storedState = sessionStorage.getItem('fedimint_ui_auth');
  if (storedState) {
    try {
      const parsedState = JSON.parse(storedState);
      return {
        ...parsedState,
        dispatch: () => null,
      };
    } catch (error) {
      console.error('Failed to parse stored auth state:', error);
    }
  }
  return {
    guardianPasswords: {},
    gatewayPasswords: {},
    dispatch: () => null,
  };
};

export enum AUTH_ACTION_TYPE {
  SET_GUARDIAN_PASSWORD = 'SET_GUARDIAN_PASSWORD',
  SET_GATEWAY_PASSWORD = 'SET_GATEWAY_PASSWORD',
  REMOVE_GUARDIAN_PASSWORD = 'REMOVE_GUARDIAN_PASSWORD',
  REMOVE_GATEWAY_PASSWORD = 'REMOVE_GATEWAY_PASSWORD',
}

export type AuthAction =
  | {
      type: AUTH_ACTION_TYPE.SET_GUARDIAN_PASSWORD;
      payload: {
        id: string;
        password: string;
      };
    }
  | {
      type: AUTH_ACTION_TYPE.SET_GATEWAY_PASSWORD;
      payload: {
        id: string;
        password: string;
      };
    }
  | {
      type: AUTH_ACTION_TYPE.REMOVE_GUARDIAN_PASSWORD;
      payload: string;
    }
  | {
      type: AUTH_ACTION_TYPE.REMOVE_GATEWAY_PASSWORD;
      payload: string;
    };

const saveToSessionStorage = (state: AuthContextValue) => {
  const { guardianPasswords, gatewayPasswords } = state;
  sessionStorage.setItem(
    'fedimint_ui_auth',
    JSON.stringify({
      guardianPasswords,
      gatewayPasswords,
    })
  );
};

const reducer = (
  state: AuthContextValue,
  action: AuthAction
): AuthContextValue => {
  switch (action.type) {
    case AUTH_ACTION_TYPE.SET_GUARDIAN_PASSWORD:
      return {
        ...state,
        guardianPasswords: {
          ...state.guardianPasswords,
          [action.payload.id]: action.payload.password,
        },
      };
    case AUTH_ACTION_TYPE.SET_GATEWAY_PASSWORD:
      return {
        ...state,
        gatewayPasswords: {
          ...state.gatewayPasswords,
          [action.payload.id]: action.payload.password,
        },
      };
    case AUTH_ACTION_TYPE.REMOVE_GUARDIAN_PASSWORD:
      return {
        ...state,
        guardianPasswords: Object.fromEntries(
          Object.entries(state.guardianPasswords).filter(
            ([key]) => key !== action.payload
          )
        ),
      };
    case AUTH_ACTION_TYPE.REMOVE_GATEWAY_PASSWORD:
      return {
        ...state,
        gatewayPasswords: Object.fromEntries(
          Object.entries(state.gatewayPasswords).filter(
            ([key]) => key !== action.payload
          )
        ),
      };
  }
};

const reducerWithMiddleware = (
  state: AuthContextValue,
  action: AuthAction
): AuthContextValue => {
  const newState = reducer(state, action);
  saveToSessionStorage(newState);
  return newState;
};

export const AuthContext = createContext<AuthContextValue>(makeInitialState());

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(
    reducerWithMiddleware,
    makeInitialState()
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

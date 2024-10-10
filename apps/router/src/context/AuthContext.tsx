import React, {
  createContext,
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { encrypt } from '../utils/crypto';

export interface AuthContextValue {
  test: string | null;
  guardianEncryptedPasswords: Record<string, string>;
  gatewayEncryptedPasswords: Record<string, string>;
  dispatch: Dispatch<AuthAction>;
  masterPassword: string | null;
  setMasterPassword: (password: string) => void;
  isMasterPasswordSet: boolean;
}

const makeInitialState = (): AuthContextValue => {
  const storedState = localStorage.getItem('fedimint_ui_auth');
  if (storedState) {
    try {
      const parsedState = JSON.parse(storedState);
      return {
        ...parsedState,
        dispatch: () => null,
        masterPassword: null,
        setMasterPassword: () => null,
        isMasterPasswordSet: false,
      };
    } catch (error) {
      console.error('Failed to parse stored auth state:', error);
    }
  }
  return {
    test: null,
    guardianEncryptedPasswords: {},
    gatewayEncryptedPasswords: {},
    dispatch: () => null,
    masterPassword: null,
    setMasterPassword: () => null,
    isMasterPasswordSet: false,
  };
};

export enum AUTH_ACTION_TYPE {
  SET_TEST = 'SET_TEST',
  SET_GUARDIAN_PASSWORD = 'SET_GUARDIAN_PASSWORD',
  SET_GATEWAY_PASSWORD = 'SET_GATEWAY_PASSWORD',
  REMOVE_GUARDIAN_PASSWORD = 'REMOVE_GUARDIAN_PASSWORD',
  REMOVE_GATEWAY_PASSWORD = 'REMOVE_GATEWAY_PASSWORD',
}

export type AuthAction =
  | {
      type: AUTH_ACTION_TYPE.SET_TEST;
      payload: string | null;
    }
  | {
      type: AUTH_ACTION_TYPE.SET_GUARDIAN_PASSWORD;
      payload: {
        id: string;
        encryptedPassword: string;
      };
    }
  | {
      type: AUTH_ACTION_TYPE.SET_GATEWAY_PASSWORD;
      payload: {
        id: string;
        encryptedPassword: string;
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

const saveToLocalStorage = (state: AuthContextValue) => {
  const { guardianEncryptedPasswords, gatewayEncryptedPasswords, test } = state;
  localStorage.setItem(
    'fedimint_ui_auth',
    JSON.stringify({
      guardianEncryptedPasswords,
      gatewayEncryptedPasswords,
      test,
    })
  );
};

const reducer = (
  state: AuthContextValue,
  action: AuthAction
): AuthContextValue => {
  switch (action.type) {
    case AUTH_ACTION_TYPE.SET_TEST:
      return {
        ...state,
        test: action.payload,
      };
    case AUTH_ACTION_TYPE.SET_GUARDIAN_PASSWORD:
      return {
        ...state,
        guardianEncryptedPasswords: {
          ...state.guardianEncryptedPasswords,
          [action.payload.id]: action.payload.encryptedPassword,
        },
      };
    case AUTH_ACTION_TYPE.SET_GATEWAY_PASSWORD:
      return {
        ...state,
        gatewayEncryptedPasswords: {
          ...state.gatewayEncryptedPasswords,
          [action.payload.id]: action.payload.encryptedPassword,
        },
      };
    case AUTH_ACTION_TYPE.REMOVE_GUARDIAN_PASSWORD:
      return {
        ...state,
        guardianEncryptedPasswords: Object.fromEntries(
          Object.entries(state.guardianEncryptedPasswords).filter(
            ([key]) => key !== action.payload
          )
        ),
      };
    case AUTH_ACTION_TYPE.REMOVE_GATEWAY_PASSWORD:
      return {
        ...state,
        gatewayEncryptedPasswords: Object.fromEntries(
          Object.entries(state.gatewayEncryptedPasswords).filter(
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
  saveToLocalStorage(newState);
  return newState;
};

export const AuthContext = createContext<AuthContextValue>(makeInitialState());

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const [masterPassword, setMasterPasswordState] = useState<string | null>(
    () => {
      return sessionStorage.getItem('masterPassword');
    }
  );

  const setMasterPassword = async (password: string | null) => {
    setMasterPasswordState(password);
    if (password) {
      sessionStorage.setItem('masterPassword', password);
      const encryptedTest = await encrypt(password, 'test');
      dispatch({
        type: AUTH_ACTION_TYPE.SET_TEST,
        payload: encryptedTest,
      });
    } else {
      sessionStorage.removeItem('masterPassword');
      dispatch({
        type: AUTH_ACTION_TYPE.SET_TEST,
        payload: null,
      });
    }
  };

  const [state, dispatch] = useReducer(
    reducerWithMiddleware,
    makeInitialState()
  );

  const isMasterPasswordSet = useMemo(() => {
    const hasPasswords =
      Object.keys(state.guardianEncryptedPasswords).length > 0 ||
      Object.keys(state.gatewayEncryptedPasswords).length > 0;
    return hasPasswords || masterPassword !== null;
  }, [
    state.guardianEncryptedPasswords,
    state.gatewayEncryptedPasswords,
    masterPassword,
  ]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        masterPassword,
        setMasterPassword,
        isMasterPasswordSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

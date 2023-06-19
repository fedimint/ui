import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GuardianApi } from './GuardianApi';
import { formatApiErrorMessage } from './utils/api';

const LOCAL_STORAGE_KEY = 'guardian-ui-state';

function makeInitialState(loadFromStorage = true): AppState {
  let storageState: Partial<AppState> = {};
  if (loadFromStorage) {
    try {
      const storageJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storageJson) {
        storageState = JSON.parse(storageJson);
      }
    } catch (err) {
      console.warn('Encountered error while fetching storage state', err);
    }
  }

  return {
    experience: 'Setup',
    ...storageState,
  };
}

const initialState = makeInitialState();

interface AppState {
  experience: 'Setup' | 'Admin';
}

interface ApiState {
  connected: boolean;
  error: string;
}

export interface AppContextValue {
  api: GuardianApi;
  apiState: ApiState;
  appState: AppState;
  transitionToAdmin: () => void;
}

export const AppContext = createContext<AppContextValue>({
  api: new GuardianApi(),
  apiState: { connected: false, error: '' },
  appState: initialState,
  transitionToAdmin: () => null,
});

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const api = new GuardianApi();
  const [appState, setAppState] = useState<AppState>(initialState);
  const [apiState, setApiState] = useState<ApiState>({
    connected: false,
    error: '',
  });

  useEffect(() => {
    !apiState.connected &&
      api
        .connect()
        .then(() => {
          setApiState({
            connected: true,
            error: '',
          });
        })
        .catch((err) => {
          setApiState({
            connected: false,
            error: formatApiErrorMessage(err),
          });
        });
  }, [api, apiState.connected]);

  // Update local storage on state changes.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
  }, [appState.experience]);

  const transitionToAdmin = useCallback(() => {
    setApiState({
      connected: false,
      error: '',
    });
    setAppState({ experience: 'Admin' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        api,
        apiState,
        appState,
        transitionToAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

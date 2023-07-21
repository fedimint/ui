import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GuardianApi } from './GuardianApi';
import { formatApiErrorMessage } from './utils/api';
import { ServerStatus } from './types';

type status = 'Loading' | 'Setup' | 'Admin' | 'Error';

export interface AppContextValue {
  api: GuardianApi;
  appState: status;
  appError?: string;
  transitionToAdmin: () => void;
}

export const AppContext = createContext<AppContextValue>({
  api: new GuardianApi(),
  appState: 'Loading',
  transitionToAdmin: () => null,
});

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const api = new GuardianApi();
  const [appState, setAppState] = useState<status>('Loading');
  const [appError, setAppError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        await api.connect();
        const status = await api.status();
        if (status.server === ServerStatus.ConsensusRunning) {
          setAppState('Admin');
        } else {
          setAppState('Setup');
        }
      } catch (err) {
        setAppState('Error');
        setAppError(formatApiErrorMessage(err));
      }
    };

    appState === 'Loading' && load().catch((err) => setAppError(err.message));
  }, [api, appState]);

  const transitionToAdmin = useCallback(() => {
    setAppState('Loading');
  }, []);

  return (
    <AppContext.Provider
      value={{
        api,
        appState,
        appError,
        transitionToAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

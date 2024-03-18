import React, {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { ConfigGenParams, ServerStatus } from '@fedimint/types';
import {
  SetupState,
  SetupAction,
  SETUP_ACTION_TYPE,
  SetupProgress,
} from '../types';
import { GuardianApi } from '../GuardianApi';
import { isConsensusparams } from '../utils/validators';

const LOCAL_STORAGE_SETUP_KEY = 'setup-guardian-ui-state';

/**
 * Creates the initial state using loaded state from local storage.
 */
function makeInitialState(loadFromStorage = true): SetupState {
  let state: SetupState = {
    role: null,
    progress: SetupProgress.Start,
    myName: '',
    configGenParams: null,
    password: '',
    numPeers: 0,
    peers: [],
    ourCurrentId: null,
  };
  if (loadFromStorage) {
    try {
      const storageJson = localStorage.getItem(LOCAL_STORAGE_SETUP_KEY);
      if (storageJson) {
        state = JSON.parse(storageJson) as SetupState;
      }
    } catch (err) {
      console.warn('Encountered error while fetching storage state', err);
    }
  }

  if (
    state.progress !== SetupProgress.Start &&
    state.configGenParams !== null &&
    isConsensusparams(state.configGenParams)
  ) {
    const peers = Object.values(state.configGenParams.peers);
    state.peers = peers;
    state.numPeers = state.numPeers ? state.numPeers : peers.length;
  }

  return state;
}

const initialState = makeInitialState();

const reducer = (state: SetupState, action: SetupAction): SetupState => {
  switch (action.type) {
    case SETUP_ACTION_TYPE.SET_INITIAL_STATE:
      return makeInitialState(false);
    case SETUP_ACTION_TYPE.SET_ROLE:
      return { ...state, role: action.payload };
    case SETUP_ACTION_TYPE.SET_PROGRESS:
      return { ...state, progress: action.payload };
    case SETUP_ACTION_TYPE.SET_MY_NAME:
      return { ...state, myName: action.payload };
    case SETUP_ACTION_TYPE.SET_CONFIG_GEN_PARAMS:
      return { ...state, configGenParams: action.payload };
    case SETUP_ACTION_TYPE.SET_PASSWORD:
      return { ...state, password: action.payload };
    case SETUP_ACTION_TYPE.SET_NUM_PEERS:
      return { ...state, numPeers: action.payload };
    case SETUP_ACTION_TYPE.SET_PEERS:
      return { ...state, peers: action.payload };
    case SETUP_ACTION_TYPE.SET_OUR_CURRENT_ID:
      return { ...state, ourCurrentId: action.payload };
    default:
      return state;
  }
};

export interface SetupContextValue {
  api: GuardianApi;
  state: SetupState;
  dispatch: Dispatch<SetupAction>;
  submitConfiguration<T extends HostConfigs | FollowerConfigs>(config: {
    myName: string;
    password: string;
    configs: T;
  }): Promise<void>;
  connectToHost(url: string): Promise<void>;
  fetchConsensusState(): Promise<void>;
  toggleConsensusPolling(toggle: boolean): void;
}

type HostConfigs = ConfigGenParams & {
  numPeers: number;
};

type FollowerConfigs = ConfigGenParams & {
  hostServerUrl: string;
};

const isHostConfigs = (
  configs: HostConfigs | FollowerConfigs
): configs is HostConfigs => {
  return (configs as HostConfigs).numPeers !== undefined;
};

const isFollowerConfigs = (
  configs: HostConfigs | FollowerConfigs
): configs is FollowerConfigs => {
  return (configs as FollowerConfigs).hostServerUrl !== undefined;
};

export const SetupContext = createContext<SetupContextValue>({
  api: new GuardianApi(),
  state: initialState,
  dispatch: () => null,
  submitConfiguration: () => Promise.reject(),
  connectToHost: () => Promise.reject(),
  fetchConsensusState: () => Promise.reject(),
  toggleConsensusPolling: () => null,
});

export interface SetupContextProviderProps {
  api: GuardianApi;
  initServerStatus: ServerStatus;
  children: ReactNode;
}

export const SetupContextProvider: React.FC<SetupContextProviderProps> = ({
  api,
  initServerStatus,
  children,
}: SetupContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    password: api.getPassword() || initialState.password,
  });
  const { password, myName } = state;
  const [isPollingConsensus, setIsPollingConsensus] = useState(false);

  useEffect(() => {
    switch (initServerStatus) {
      case ServerStatus.AwaitingPassword:
        // If we're still waiting for a password, restart the whole thing.
        dispatch({
          type: SETUP_ACTION_TYPE.SET_INITIAL_STATE,
          payload: null,
        });
        break;
      case ServerStatus.ReadyForConfigGen:
        // If we're ready for DKG, move them to approve the config to start.
        dispatch({
          type: SETUP_ACTION_TYPE.SET_PROGRESS,
          payload: SetupProgress.ConnectGuardians,
        });
        break;
      case ServerStatus.VerifyingConfigs:
      case ServerStatus.VerifiedConfigs:
        // If we're supposed to be verifying, or have verified, jump to peer validation screen
        dispatch({
          type: SETUP_ACTION_TYPE.SET_PROGRESS,
          payload: SetupProgress.VerifyGuardians,
        });
        break;
      case ServerStatus.ConsensusRunning:
      default:
        // We should never boot into these states with the setup UI. We probably should show error
        // For now, skip past all setup, and transition to admin.
        dispatch({
          type: SETUP_ACTION_TYPE.SET_IS_SETUP_COMPLETE,
          payload: true,
        });
        break;
    }
  }, [initServerStatus]);

  // Update local storage on state changes.
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_SETUP_KEY,
      JSON.stringify({
        role: state.role,
        progress: state.progress,
        myName: state.myName,
        numPeers: state.numPeers,
        configGenParams: state.configGenParams,
        ourCurrentId: state.ourCurrentId,
      })
    );

    return () => {
      // Clear local storage on setup complete.
      // This happens when we transition to admin experience.
      if (state.progress === SetupProgress.SetupComplete) {
        localStorage.removeItem(LOCAL_STORAGE_SETUP_KEY);
      }
    };
  }, [
    state.role,
    state.progress,
    state.myName,
    state.numPeers,
    state.configGenParams,
    state.ourCurrentId,
  ]);

  // Fetch consensus state, dispatch updates with it.
  const fetchConsensusState = useCallback(async () => {
    const consensusState = await api.getConsensusConfigGenParams();
    dispatch({
      type: SETUP_ACTION_TYPE.SET_OUR_CURRENT_ID,
      payload: consensusState.our_current_id,
    });
    dispatch({
      type: SETUP_ACTION_TYPE.SET_PEERS,
      payload: Object.values(consensusState.consensus.peers),
    });
    dispatch({
      type: SETUP_ACTION_TYPE.SET_CONFIG_GEN_PARAMS,
      payload: consensusState.consensus,
    });
  }, [api]);

  // Poll for peer state every 2 seconds when isPollingPeers.
  useEffect(() => {
    if (!isPollingConsensus) return;
    let timeout: ReturnType<typeof setTimeout>;
    const pollPeers = () => {
      fetchConsensusState()
        .catch((err) => {
          console.warn('Failed to poll for peers', err);
        })
        .finally(() => {
          timeout = setTimeout(pollPeers, 2000);
        });
    };
    pollPeers();
    return () => clearTimeout(timeout);
  }, [isPollingConsensus, fetchConsensusState]);

  // Single call to save all of the host / follower configurations
  const submitConfiguration: SetupContextValue['submitConfiguration'] =
    useCallback(
      async ({ password: newPassword, myName, configs }) => {
        if (!password) {
          await api.setPassword(newPassword);

          dispatch({
            type: SETUP_ACTION_TYPE.SET_PASSWORD,
            payload: newPassword,
          });
        }

        dispatch({
          type: SETUP_ACTION_TYPE.SET_MY_NAME,
          payload: myName,
        });

        if (isHostConfigs(configs)) {
          dispatch({
            type: SETUP_ACTION_TYPE.SET_NUM_PEERS,
            payload: configs.numPeers,
          });

          // Hosts set their own connection name only.
          await api.setConfigGenConnections(myName);

          // Hosts submit both their local and the consensus config gen params.
          await api.setConfigGenParams(configs);
          dispatch({
            type: SETUP_ACTION_TYPE.SET_CONFIG_GEN_PARAMS,
            payload: configs,
          });
        }

        if (isFollowerConfigs(configs)) {
          // Followers set their own connection name, and hosts server URL to connect to.
          await api.setConfigGenConnections(myName, configs.hostServerUrl);

          // Followers submit ONLY their local config gen params.
          await api.setConfigGenParams(configs);

          // Followers fetch consensus config gen params from the host.
          await fetchConsensusState();
        }
      },
      [password, api, dispatch, fetchConsensusState]
    );

  const connectToHost = useCallback(
    async (url: string) => {
      await api.setConfigGenConnections(myName, url);
      return await fetchConsensusState();
    },
    [myName, api, fetchConsensusState]
  );

  const toggleConsensusPolling = useCallback((poll: boolean) => {
    setIsPollingConsensus(poll);
  }, []);

  return (
    <SetupContext.Provider
      value={{
        state,
        dispatch,
        api,
        submitConfiguration,
        connectToHost,
        fetchConsensusState,
        toggleConsensusPolling,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
};

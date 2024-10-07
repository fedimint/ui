import { Dispatch, useCallback, useContext, useEffect, useState } from 'react';
import { AppContext, AppContextValue } from './AppContext';
import {
  GuardianContext,
  GuardianContextValue,
} from './guardian/GuardianContext';
import {
  GUARDIAN_APP_ACTION_TYPE,
  GuardianAppAction,
  GuardianAppState,
  GuardianConfig,
  GuardianStatus,
  SETUP_ACTION_TYPE,
  SetupAction,
  SetupProgress,
  SetupState,
} from '../types/guardian';
import {
  AdminApiInterface,
  GuardianApi,
  SetupApiInterface,
} from '../api/GuardianApi';
import {
  ConfigGenParams,
  GatewayInfo,
  GuardianServerStatus,
} from '@fedimint/types';
import { formatApiErrorMessage } from '../guardian-ui/utils/api';
import {
  LOCAL_STORAGE_SETUP_KEY,
  SetupContext,
  SetupContextValue,
} from './guardian/SetupContext';
import {
  GATEWAY_APP_ACTION_TYPE,
  GatewayAppAction,
  GatewayAppState,
  GatewayConfig,
} from '../types/gateway';
import { GatewayContext, GatewayContextValue } from './gateway/GatewayContext';
import { GatewayApi } from '../api/GatewayApi';
import { useUnlockedService } from '../hooks/useUnlockedService';
import { useAuthContext } from '../hooks/useAuthContext';

export function useAppContext(): AppContextValue {
  return useContext(AppContext);
}

export function useAppGuardianConfigs(): GuardianConfig[] {
  const { guardians } = useAppContext();
  return Object.values(guardians).map((guardian) => ({
    id: guardian.id,
    config: guardian.config,
  }));
}

export function useNumberOfGuardians(): number {
  return Object.keys(useAppContext().guardians).length;
}

export function useNumberOfGateways(): number {
  return Object.keys(useAppContext().gateways).length;
}

export const useGuardianConfig = (id: string): GuardianConfig => {
  const { guardians } = useAppContext();
  if (!guardians[id])
    throw new Error('useGuardianConfig must be used with a selected guardian');
  return { id, config: guardians[id].config };
};

export const useGatewayConfig = (id: string): GatewayConfig => {
  const { gateways } = useAppContext();
  if (!gateways[id])
    throw new Error('useGatewayConfig must be used with a selected gateway');
  return { id, config: gateways[id].config };
};

export const useGuardianDispatch = (): Dispatch<GuardianAppAction> => {
  const guardian = useGuardianContext();
  if (!guardian)
    throw new Error(
      'useGuardianDispatch must be used within a GuardianContextProvider'
    );
  return guardian.dispatch;
};

export const useLoadGuardian = (): void => {
  const { api, state, dispatch, id } = useGuardianContext();
  const { decryptedServicePassword } = useUnlockedService(id, 'guardian');

  useEffect(() => {
    const load = async () => {
      try {
        await api.connect();
        const server = (await api.status()).server;

        // If they're at a point where a password has been configured, make
        // sure they have a valid password set. If not, set needsAuth.
        if (server !== GuardianServerStatus.AwaitingPassword) {
          const hasValidPassword = decryptedServicePassword
            ? await api.testPassword(decryptedServicePassword)
            : false;
          if (!hasValidPassword) {
            dispatch({
              type: GUARDIAN_APP_ACTION_TYPE.SET_NEEDS_AUTH,
              payload: true,
            });
          }
        }

        if (server === GuardianServerStatus.ConsensusRunning) {
          dispatch({
            type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
            payload: GuardianStatus.Admin,
          });
        } else {
          dispatch({
            type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
            payload: GuardianStatus.Setup,
          });
        }

        dispatch({
          type: GUARDIAN_APP_ACTION_TYPE.SET_INIT_SERVER_STATUS,
          payload: server,
        });
      } catch (err) {
        dispatch({
          type: GUARDIAN_APP_ACTION_TYPE.SET_ERROR,
          payload: formatApiErrorMessage(err),
        });
      }
    };

    if (state.status === GuardianStatus.Loading) {
      load().catch((err) => console.error(err));
    }
  }, [state.status, api, dispatch, id, decryptedServicePassword]);
};

export const useGuardianContext = (): GuardianContextValue => {
  const guardian = useContext(GuardianContext);
  if (!guardian)
    throw new Error(
      'useGuardianContext must be used within a GuardianContextProvider'
    );
  return guardian;
};

export const useGuardianApi = (): GuardianApi => {
  const guardian = useGuardianContext();
  return guardian.api;
};

export const useGuardianState = (): GuardianAppState => {
  const guardian = useGuardianContext();
  return guardian.state;
};

export const useGuardianStatus = (): GuardianStatus => {
  const guardian = useGuardianContext();
  if (!guardian) return GuardianStatus.Loading;
  return guardian.state.status;
};

export const useGuardianAdminApi = (): AdminApiInterface => {
  const guardian = useGuardianContext();
  return guardian.api;
};

export const useGuardianSetupContext = (): SetupContextValue => {
  const setup = useContext(SetupContext);
  if (!setup)
    throw new Error(
      'useGuardianSetupContext must be used within a SetupContextProvider'
    );
  return setup;
};

export const useGuardianSetupApi = (): SetupApiInterface => {
  const guardian = useGuardianContext();
  return guardian.api;
};

/**
 * Tells the guardian context to poll for updates. Handles turning off polling
 * on dismount.
 */
export function useConsensusPolling(shouldPoll = true) {
  const { toggleConsensusPolling } = useGuardianSetupContext();

  useEffect(() => {
    if (!shouldPoll) return;
    toggleConsensusPolling(true);
    return () => toggleConsensusPolling(false);
  }, [shouldPoll, toggleConsensusPolling]);
}

export const useHandleSetupServerStatus = (
  initServerStatus: GuardianServerStatus,
  dispatch: Dispatch<SetupAction>
): void => {
  useEffect(() => {
    switch (initServerStatus) {
      case GuardianServerStatus.AwaitingPassword:
        // If we're still waiting for a password, restart the whole thing.
        dispatch({
          type: SETUP_ACTION_TYPE.SET_INITIAL_STATE,
          payload: null,
        });
        break;
      case GuardianServerStatus.ReadyForConfigGen:
        // If we're ready for DKG, move them to approve the config to start.
        dispatch({
          type: SETUP_ACTION_TYPE.SET_PROGRESS,
          payload: SetupProgress.ConnectGuardians,
        });
        break;
      case GuardianServerStatus.VerifyingConfigs:
      case GuardianServerStatus.VerifiedConfigs:
        // If we're supposed to be verifying, or have verified, jump to peer validation screen
        dispatch({
          type: SETUP_ACTION_TYPE.SET_PROGRESS,
          payload: SetupProgress.VerifyGuardians,
        });
        break;
      case GuardianServerStatus.ConsensusRunning:
      default:
        // We should never boot into these states with the setup UI. We probably should show error
        // For now, skip past all setup, and transition to admin.
        dispatch({
          type: SETUP_ACTION_TYPE.SET_IS_SETUP_COMPLETE,
          payload: true,
        });
        break;
    }
  }, [initServerStatus, dispatch]);
};

export const useUpdateLocalStorageOnSetupStateChange = (
  id: string,
  state: SetupState
): void => {
  useEffect(() => {
    localStorage.setItem(
      `${LOCAL_STORAGE_SETUP_KEY}-${id}`,
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
        localStorage.removeItem(`${LOCAL_STORAGE_SETUP_KEY}-${id}`);
      }
    };
  }, [
    state.role,
    state.progress,
    state.myName,
    state.numPeers,
    state.configGenParams,
    state.ourCurrentId,
    id,
  ]);
};

export type HostConfigs = ConfigGenParams & {
  numPeers: number;
};

export type FollowerConfigs = ConfigGenParams & {
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

export const useHandleBackgroundGuardianSetupActions = (
  state: SetupState,
  dispatch: Dispatch<SetupAction>
): {
  submitConfiguration: SetupContextValue['submitConfiguration'];
  connectToHost: SetupContextValue['connectToHost'];
  fetchConsensusState: SetupContextValue['fetchConsensusState'];
  toggleConsensusPolling: SetupContextValue['toggleConsensusPolling'];
} => {
  const api = useGuardianApi();
  const { id } = useGuardianContext();
  const { storeGuardianPassword } = useAuthContext();
  const { password, myName } = state;
  const [isPollingConsensus, setIsPollingConsensus] = useState(false);

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
  }, [api, dispatch]);

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
          storeGuardianPassword(id, newPassword);
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
      [password, api, dispatch, fetchConsensusState, id, storeGuardianPassword]
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

  return {
    submitConfiguration,
    connectToHost,
    fetchConsensusState,
    toggleConsensusPolling,
  };
};

export const useGatewayContext = (): GatewayContextValue => {
  const gateway = useContext(GatewayContext);
  if (!gateway)
    throw new Error(
      'useGatewayContext must be used within a GatewayContextProvider'
    );
  return gateway;
};

export const useGatewayApi = (): GatewayApi => {
  const gateway = useGatewayContext();
  return gateway.api;
};

export const useGatewayState = (): GatewayAppState => {
  const gateway = useGatewayContext();
  return gateway.state;
};

export const useGatewayDispatch = (): Dispatch<GatewayAppAction> => {
  const gateway = useGatewayContext();
  if (!gateway)
    throw new Error(
      'useGatewayDispatch must be used within a GatewayContextProvider'
    );
  return gateway.dispatch;
};

export const useGatewayInfo = (): GatewayInfo => {
  const gateway = useGatewayContext();
  if (!gateway.state.gatewayInfo)
    throw new Error(
      'useGatewayInfo must be used within a GatewayContextProvider'
    );
  return gateway.state.gatewayInfo;
};

export const useLoadGateway = () => {
  const state = useGatewayState();
  const dispatch = useGatewayDispatch();

  const api = useGatewayApi();

  useEffect(() => {
    if (!state.needsAuth) {
      const fetchInfoAndConfigs = async () => {
        try {
          const gatewayInfo = await api.fetchInfo();

          const configs = await api.fetchConfigs();

          const updatedFederations = gatewayInfo.federations.map(
            (federation) => ({
              ...federation,
              config: configs.federations[federation.federation_id],
            })
          );

          const updatedGatewayInfo = {
            ...gatewayInfo,
            federations: updatedFederations,
          };

          dispatch({
            type: GATEWAY_APP_ACTION_TYPE.SET_GATEWAY_INFO,
            payload: updatedGatewayInfo,
          });
        } catch (error: unknown) {
          console.error(error);
          dispatch({
            type: GATEWAY_APP_ACTION_TYPE.SET_ERROR,
            payload: (error as Error).message,
          });
        }
      };

      const fetchBalances = () => {
        api
          .fetchBalances()
          .then((balances) => {
            dispatch({
              type: GATEWAY_APP_ACTION_TYPE.SET_BALANCES,
              payload: balances,
            });
          })
          .catch(({ message, error }) => {
            console.error(error);
            dispatch({
              type: GATEWAY_APP_ACTION_TYPE.SET_ERROR,
              payload: message,
            });
          });
      };

      fetchInfoAndConfigs();
      fetchBalances();

      const interval = setInterval(fetchInfoAndConfigs, 5000);
      return () => clearInterval(interval);
    }
  }, [state.needsAuth, api, dispatch]);
};

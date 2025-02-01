import { Dispatch, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sha256Hash } from '@fedimint/utils';
import {
  APP_ACTION_TYPE,
  AppAction,
  AppContext,
  AppContextValue,
} from '../context/AppContext';
import { getServiceType } from '../helpers/service';

export function useAppContext(): AppContextValue {
  return useContext(AppContext);
}

export const useActiveService = (): {
  type: 'guardian' | 'gateway';
  id: string;
} | null => {
  const location = useLocation();
  const [type, id] = location.pathname.split('/').filter(Boolean);

  if (!type || !id || (type !== 'guardian' && type !== 'gateway')) {
    return null;
  }

  return {
    type,
    id,
  };
};

export function useAppInit(dispatch: Dispatch<AppAction>) {
  useEffect(() => {
    const init = async () => {
      const url =
        process.env.REACT_APP_FM_CONFIG_API ||
        process.env.REACT_APP_FM_GATEWAY_API;

      if (url) {
        const service = getServiceType(url);
        const hash = await sha256Hash(url);
        const actionType =
          service === 'guardian'
            ? APP_ACTION_TYPE.ADD_GUARDIAN
            : APP_ACTION_TYPE.ADD_GATEWAY;

        dispatch({
          type: actionType,
          payload: {
            id: hash,
            service: {
              config: {
                id: hash,
                baseUrl: url,
              },
            },
          },
        });
      }
    };

    init();
  }, [dispatch]);
}

export * from './guardian/useGuardian';
export * from './guardian/useGuardianSetup';
export * from './gateway/useGateway';
export * from './custom/useTrimmedInput';

import { useState, useCallback } from 'react';
import { sha256Hash } from '@fedimint/utils';
import { useAppContext } from '../../../context/hooks';
import { APP_ACTION_TYPE } from '../../../context/AppContext';
import { checkServiceExists, getServiceType } from '../../utils';
import {
  ServiceCheckApi,
  ServiceCheckResponse,
} from '../../../api/ServiceCheckApi';
import { useAuthContext } from '../../../hooks/useAuthContext';

export const useConnectServiceForm = (onClose: () => void) => {
  const { storeGuardianPassword, storeGatewayPassword } = useAuthContext();
  const [configUrl, setConfigUrl] = useState('');
  const [password, setPassword] = useState('');
  const [serviceInfo, setServiceInfo] = useState<ServiceCheckResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const { guardians, gateways, dispatch } = useAppContext();

  const resetForm = useCallback(() => {
    setConfigUrl('');
    setPassword('');
    setServiceInfo(null);
    setError(null);
    setRequiresPassword(false);
  }, []);

  const handleCheck = useCallback(async () => {
    const api = new ServiceCheckApi();
    setIsLoading(true);
    setError(null);
    try {
      if (checkServiceExists(configUrl, guardians, gateways)) {
        setError('A service with this URL already exists');
        return;
      }
      let info: ServiceCheckResponse;
      if (!requiresPassword) {
        info = await api.checkWithoutPassword(configUrl);
        if (info.requiresPassword) {
          setRequiresPassword(true);
          setServiceInfo(null);
          return;
        }
      } else {
        info = await api.checkWithPassword(configUrl, password);
      }
      setServiceInfo(info);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  }, [configUrl, password, guardians, gateways, requiresPassword]);

  const handleConfirm = useCallback(async () => {
    setError(null);
    try {
      const id = await sha256Hash(configUrl);
      const serviceType = getServiceType(configUrl);

      if (serviceType === 'guardian') {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: { id, guardian: { id, config: { baseUrl: configUrl } } },
        });
        storeGuardianPassword(id, password);
      } else {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, gateway: { id, config: { baseUrl: configUrl } } },
        });
        storeGatewayPassword(id, password);
      }
      resetForm();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }, [
    configUrl,
    password,
    dispatch,
    resetForm,
    onClose,
    storeGatewayPassword,
    storeGuardianPassword,
  ]);

  return {
    configUrl,
    setConfigUrl,
    password,
    setPassword,
    serviceInfo,
    isLoading,
    error,
    requiresPassword,
    handleCheck,
    handleConfirm,
    resetForm,
  };
};

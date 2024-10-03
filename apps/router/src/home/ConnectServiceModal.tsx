import React, { useCallback, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Badge,
  Flex,
  Box,
  Divider,
} from '@chakra-ui/react';
import { sha256Hash, useTranslation } from '@fedimint/utils';
import { useAppContext } from '../context/hooks';
import { APP_ACTION_TYPE } from '../context/AppContext';
import { checkServiceExists, getServiceType } from './utils';
import { ServiceCheckApi, ServiceCheckResponse } from '../api/ServiceCheckApi';
import { useAuth } from '../hooks/useAuth';

interface ConnectServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectServiceModal: React.FC<ConnectServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { setGuardianPassword, setGatewayPassword } = useAuth();
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
        setGuardianPassword(id, password);
      } else {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, gateway: { id, config: { baseUrl: configUrl } } },
        });
        setGatewayPassword(id, password);
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
    setGatewayPassword,
    setGuardianPassword,
  ]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!serviceInfo) {
          handleCheck();
        } else {
          handleConfirm();
        }
      }
    },
    [serviceInfo, handleCheck, handleConfirm]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      size='lg'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('home.connect-service-modal.title', 'Connect a Service')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {error && (
            <Text color='red.500' mb={4}>
              {error}
            </Text>
          )}
          <FormControl isInvalid={!!error}>
            <FormLabel>{t('home.connect-service-modal.url-label')}</FormLabel>
            <Input
              placeholder='wss://fedimintd.domain.com:6000'
              value={configUrl}
              onChange={(e) => setConfigUrl(e.target.value)}
            />
          </FormControl>
          {requiresPassword && (
            <FormControl mt={4}>
              <FormLabel>{t('common.password')}</FormLabel>
              <Input
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Text fontSize='sm' color='gray.500' mt={1}>
                {t('home.connect-service-modal.valid-service-password-hint')}
              </Text>
            </FormControl>
          )}
          {!serviceInfo && (
            <Button
              mt={4}
              colorScheme='blue'
              onClick={handleCheck}
              isLoading={isLoading}
            >
              {t('common.check')}
            </Button>
          )}
          {serviceInfo && (
            <>
              <Divider my={6} />
              <FormControl>
                <ServiceInfoDisplay serviceInfo={serviceInfo} />
              </FormControl>
              <Button mt={4} colorScheme='green' onClick={handleConfirm}>
                {t('common.connect')}
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface ServiceInfoDisplayProps {
  serviceInfo: ServiceCheckResponse;
}

export const ServiceInfoDisplay: React.FC<ServiceInfoDisplayProps> = ({
  serviceInfo,
}) => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' align='stretch' gap={4} width='100%'>
      <Box>
        <Text fontSize='lg' fontWeight='bold' display='inline'>
          {t('home.connect-service-modal.service-type-label')}:{' '}
        </Text>
        <Badge colorScheme={'blue'} fontSize='md' px={2} py={1}>
          {serviceInfo.serviceType.toUpperCase()}
        </Badge>
      </Box>
      {serviceInfo.serviceType === 'gateway' && (
        <Box>
          <Text fontSize='lg' fontWeight='bold' display='inline'>
            {t('home.connect-service-modal.service-name-label')}:{' '}
          </Text>
          <Text fontSize='lg' display='inline'>
            {serviceInfo.serviceName}
          </Text>
        </Box>
      )}
      <Box>
        <Text fontSize='lg' fontWeight='bold' display='inline'>
          {t('home.connect-service-modal.status-label')}:{' '}
        </Text>
        <Badge colorScheme='blue' fontSize='md' px={2} py={1}>
          {serviceInfo.status === 'AWAITING_PASSWORD'
            ? 'SETUP'
            : serviceInfo.status}
        </Badge>
      </Box>
    </Flex>
  );
};

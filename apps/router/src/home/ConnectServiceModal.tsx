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
import { ServiceCheckApi } from '../api/ServiceCheckApi';

interface ConnectServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectServiceModal: React.FC<ConnectServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [configUrl, setConfigUrl] = useState('');
  const [password, setPassword] = useState('');
  const [serviceInfo, setServiceInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { guardians, gateways, dispatch } = useAppContext();

  const resetForm = useCallback(() => {
    setConfigUrl('');
    setPassword('');
    setServiceInfo(null);
    setError(null);
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
      const info = await api.check(configUrl, password);
      setServiceInfo(JSON.stringify(info, null, 2));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  }, [configUrl, password, guardians, gateways]);

  const handleConfirm = useCallback(async () => {
    setError(null);
    try {
      const id = await sha256Hash(configUrl);
      const serviceType = getServiceType(configUrl);

      if (serviceType === 'guardian') {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: { id, guardian: { config: { baseUrl: configUrl } } },
        });
      } else {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, gateway: { config: { baseUrl: configUrl } } },
        });
      }
      resetForm();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }, [configUrl, dispatch, resetForm, onClose]);

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

  const renderServiceInfo = () => {
    if (!serviceInfo) return null;
    const info = JSON.parse(serviceInfo);
    return (
      <Flex direction='column' align='stretch' gap={4} width='100%'>
        <Box>
          <Text fontSize='lg' fontWeight='bold' display='inline'>
            {t('home.connect-service-modal.service-type-label')}:{' '}
          </Text>
          <Badge colorScheme={'blue'} fontSize='md' px={2} py={1}>
            {info.serviceType.toUpperCase()}
          </Badge>
        </Box>
        {info.serviceType === 'gateway' && (
          <Box>
            <Text fontSize='lg' fontWeight='bold' display='inline'>
              {t('home.connect-service-modal.service-name-label')}:{' '}
            </Text>
            <Text fontSize='lg' display='inline'>
              {info.serviceName}
            </Text>
          </Box>
        )}
        <Box>
          <Text fontSize='lg' fontWeight='bold' display='inline'>
            {t('home.connect-service-modal.sync-status-label')}:{' '}
          </Text>
          <Badge
            colorScheme={info.synced ? 'green' : 'red'}
            fontSize='md'
            px={2}
            py={1}
          >
            {info.synced ? 'SYNCED' : 'NOT SYNCED'}
          </Badge>
        </Box>
      </Flex>
    );
  };

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
          <FormControl mt={4}>
            <FormLabel>{t('common.password')}</FormLabel>
            <Input
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </FormControl>
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
              <FormControl>{renderServiceInfo()}</FormControl>
              <Button mt={4} colorScheme='green' onClick={handleConfirm}>
                {t('common.confirm')}
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

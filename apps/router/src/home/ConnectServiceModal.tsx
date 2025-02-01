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
} from '@chakra-ui/react';
import { sha256Hash, useTranslation } from '@fedimint/utils';
import { useAppContext } from '../hooks';
import { APP_ACTION_TYPE } from '../context/AppContext';
import { getServiceType } from '../helpers/service';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { guardians, gateways, dispatch } = useAppContext();

  const resetForm = useCallback(() => {
    setConfigUrl('');
    setError(null);
  }, []);

  const checkServiceExists = useCallback(
    async (url: string) => {
      const id = await sha256Hash(url);
      return id in guardians || id in gateways;
    },
    [guardians, gateways]
  );

  const handleConfirm = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const exists = await checkServiceExists(configUrl);
      if (exists) {
        throw new Error('Service already exists');
      }

      const id = await sha256Hash(configUrl);
      const serviceType = getServiceType(configUrl);

      // helps to prevent user adding empty / invalid url
      if (!serviceType) return;

      if (serviceType === 'guardian') {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: { id, service: { config: { id, baseUrl: configUrl } } },
        });
      } else {
        dispatch({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: { id, service: { config: { id, baseUrl: configUrl } } },
        });
      }

      resetForm();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  }, [configUrl, dispatch, resetForm, onClose, checkServiceExists]);

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme='blue'
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {t('common.confirm')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface ServiceInfoDisplayProps {
  serviceInfo: string;
}

export const ServiceInfoDisplay: React.FC<ServiceInfoDisplayProps> = ({
  serviceInfo,
}) => {
  const { t } = useTranslation();
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

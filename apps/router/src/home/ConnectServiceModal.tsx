import React, { useState } from 'react';
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
  Textarea,
  FormErrorMessage,
  Text,
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

  const handleCheck = async () => {
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
  };

  const handleConfirm = async () => {
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

      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  const resetForm = () => {
    setConfigUrl('');
    setPassword('');
    setServiceInfo(null);
    setError(null);
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
          {!serviceInfo ? (
            <>
              <FormControl isInvalid={!!error}>
                <FormLabel>
                  {t('home.connect-service-modal.url-label')}
                </FormLabel>
                <Input
                  placeholder='wss://fedimintd.domain.com:6000'
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme='blue'
                onClick={handleCheck}
                isLoading={isLoading}
              >
                {t('common.submit')}
              </Button>
            </>
          ) : (
            <>
              <FormControl>
                <FormLabel>Service Info</FormLabel>
                <Textarea
                  value={serviceInfo}
                  readOnly
                  height='200px'
                  fontFamily='mono'
                />
              </FormControl>
              <Button mt={4} colorScheme='green' onClick={handleConfirm}>
                Confirm
              </Button>
              <Button mt={4} ml={2} onClick={resetForm}>
                Back
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

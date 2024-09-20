import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { sha256Hash, useTranslation } from '@fedimint/utils';
import { useAppContext } from '../context/hooks';
import { APP_ACTION_TYPE } from '../context/AppContext';
import { checkServiceExists, getServiceType } from './utils';

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
  const { guardians, gateways, dispatch } = useAppContext();
  const toast = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (checkServiceExists(configUrl, guardians, gateways)) {
        throw new Error('A service with this URL already exists');
      }

      const serviceType = getServiceType(configUrl);
      const id = await sha256Hash(configUrl);

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

      setConfigUrl('');
      onClose();
      toast({
        title: 'Service added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error adding service',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('home.connect-service-modal.title', 'Connect a Service')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>{t('home.connect-service-modal.url-label')}</FormLabel>
            <Input
              placeholder='wss://fedimintd.domain.com:6000'
              value={configUrl}
              onChange={(e) => setConfigUrl(e.target.value)}
            />
            <FormHelperText fontSize='sm'>
              {t('home.connect-service-modal.helper-text')}
            </FormHelperText>
          </FormControl>
          <Button
            mt={4}
            colorScheme='blue'
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {t('common.submit')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

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
  useToast,
} from '@chakra-ui/react';
import { sha256Hash, useTranslation } from '@fedimint/utils';
import { useAppContext } from '../hooks';
import { APP_ACTION_TYPE, AppAction } from '../context/AppContext';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: { type: 'guardian' | 'gateway'; id: string };
  serviceUrl: string;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  serviceUrl,
}) => {
  const { t } = useTranslation();
  const [configUrl, setConfigUrl] = useState(serviceUrl);
  const { dispatch, guardians, gateways } = useAppContext();
  const toast = useToast();

  const handleSubmit = async () => {
    if (service) {
      try {
        const newId = await sha256Hash(configUrl);

        // Check if the new URL already exists
        const serviceExists = Object.values({ ...guardians, ...gateways }).some(
          (s) => s.config.baseUrl === configUrl
        );

        if (serviceExists) {
          throw new Error('A service with this URL already exists');
        }

        // Remove old service
        dispatch({
          type:
            service.type === 'guardian'
              ? APP_ACTION_TYPE.REMOVE_GUARDIAN
              : APP_ACTION_TYPE.REMOVE_GATEWAY,
          payload: service.id,
        });

        // Add new service
        const newPayload = {
          id: newId,
          [service.type]: { config: { baseUrl: configUrl } },
        };

        dispatch({
          type:
            service.type === 'guardian'
              ? APP_ACTION_TYPE.ADD_GUARDIAN
              : APP_ACTION_TYPE.ADD_GATEWAY,
          payload: newPayload,
        } as AppAction);

        onClose();
        toast({
          title: 'Service updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error updating service',
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('home.edit-service-modal.title', {
            type: service.type.charAt(0).toUpperCase() + service.type.slice(1),
          })}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>{t('home.edit-service-modal.url-label')}</FormLabel>
            <Input
              value={configUrl}
              onChange={(e) => setConfigUrl(e.target.value)}
            />
          </FormControl>
          <Button mt={4} colorScheme='blue' onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

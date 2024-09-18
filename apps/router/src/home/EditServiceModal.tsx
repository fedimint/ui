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
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useAppContext } from '../context/hooks';
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
  const { dispatch } = useAppContext();

  const handleSubmit = () => {
    if (service) {
      const payload = {
        id: service.id,
        [service.type]: { config: { baseUrl: configUrl } },
      };

      dispatch({
        type:
          service.type === 'guardian'
            ? APP_ACTION_TYPE.UPDATE_GUARDIAN
            : APP_ACTION_TYPE.UPDATE_GATEWAY,
        payload,
      } as AppAction);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t(
            'home.editService',
            `Edit ${
              service.type.charAt(0).toUpperCase() + service.type.slice(1)
            }`
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>{t('notConfigured.urlLabel')}</FormLabel>
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

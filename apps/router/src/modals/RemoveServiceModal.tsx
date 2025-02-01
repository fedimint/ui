import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useAppContext } from '../hooks';
import { APP_ACTION_TYPE } from '../context/AppContext';

interface RemoveServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: { type: 'guardian' | 'gateway'; id: string };
}

export const RemoveServiceModal: React.FC<RemoveServiceModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useAppContext();

  const handleRemove = () => {
    if (service) {
      dispatch({
        type:
          service.type === 'guardian'
            ? APP_ACTION_TYPE.REMOVE_GUARDIAN
            : APP_ACTION_TYPE.REMOVE_GATEWAY,
        payload: service.id,
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('home.remove-service-modal.title', {
            type: service.type.charAt(0).toUpperCase() + service.type.slice(1),
          })}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {t('home.remove-service-modal.confirm', {
              type: service.type,
            })}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme='red' mr={3} onClick={handleRemove}>
            {t('common.remove')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

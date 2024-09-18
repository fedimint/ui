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
import { useAppContext } from '../context/hooks';
import { APP_ACTION_TYPE } from '../context/AppContext';

interface DeleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: { type: 'guardian' | 'gateway'; id: string };
}

export const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useAppContext();

  const handleDelete = () => {
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
          {t(
            'home.deleteService',
            `Delete ${
              service.type.charAt(0).toUpperCase() + service.type.slice(1)
            }`
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {t(
              'home.deleteServiceConfirm',
              `Are you sure you want to delete this ${service?.type}?`
            )}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={handleDelete}>
            {t('common.delete')}
          </Button>
          <Button variant='ghost' onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

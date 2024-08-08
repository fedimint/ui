import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('role-selector.warning-modal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{t('role-selector.warning-modal.description')}</ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onConfirm}>
            {t('common.confirm')}
          </Button>
          <Button variant='ghost' onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

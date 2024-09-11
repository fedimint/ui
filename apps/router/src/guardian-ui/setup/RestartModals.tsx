import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

interface RestartModalsProps {
  isPeerRestarted: boolean;
  confirmRestart: boolean;
  handleRestart: () => void;
  setConfirmRestart: (value: boolean) => void;
}

export const RestartModals: React.FC<RestartModalsProps> = ({
  isPeerRestarted,
  confirmRestart,
  handleRestart,
  setConfirmRestart,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal isOpen={isPeerRestarted} onClose={handleRestart}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('setup.common.restart-setup')}</ModalHeader>
          <ModalBody>{t('setup.common.restart-setup-alert')}</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleRestart}>
              {t('setup.common.restart-setup')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={confirmRestart} onClose={() => setConfirmRestart(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{t('setup.common.confirm-restart-setup')}</ModalHeader>
          <ModalBody>{t('setup.common.confirm-restart-setup-alert')}</ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                setConfirmRestart(false);
                handleRestart();
              }}
            >
              {t('setup.common.restart-setup')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

import React, { useCallback } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useConnectServiceForm } from './useConnectServiceForm';
import { ConnectServiceForm } from './ConnectServiceForm';
import { useMasterPassword } from '../../hooks/useMasterPassword';
import { MasterPasswordModalBody } from './MasterPasswordModalBody';

interface ConnectServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectServiceModal: React.FC<ConnectServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { isMasterPasswordSet } = useMasterPassword();
  const {
    configUrl,
    setConfigUrl,
    password,
    setPassword,
    serviceInfo,
    isLoading,
    error,
    requiresPassword,
    handleCheck,
    handleConfirm,
    resetForm,
  } = useConnectServiceForm(onClose);

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
          {isMasterPasswordSet ? (
            <ConnectServiceForm
              configUrl={configUrl}
              setConfigUrl={setConfigUrl}
              password={password}
              setPassword={setPassword}
              serviceInfo={serviceInfo}
              isLoading={isLoading}
              error={error}
              requiresPassword={requiresPassword}
              handleCheck={handleCheck}
              handleConfirm={handleConfirm}
              handleKeyPress={handleKeyPress}
            />
          ) : (
            <MasterPasswordModalBody />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';
import { hexToBlob } from '../utils/api';

export const DownloadBackup: React.FC = () => {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const { api } = useAdminContext();
  const { t } = useTranslation();

  const handleConfirmDownload = async () => {
    const response = await api.downloadGuardianBackup();
    const blob = hexToBlob(response.tar_archive_bytes, 'application/x-tar');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'guardianBackup.tar');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsWarningModalOpen(false);
  };

  return (
    <>
      <Flex justifyContent='center'>
        <Button colorScheme='blue' onClick={() => setIsWarningModalOpen(true)}>
          {t('federation-dashboard.config.downloadBackup.button')}
        </Button>
      </Flex>
      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t('federation-dashboard.config.downloadBackup.warningTitle')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t('federation-dashboard.config.downloadBackup.warningText')}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => setIsWarningModalOpen(false)}
            >
              {t('federation-dashboard.config.downloadBackup.cancelButton')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => {
                handleConfirmDownload().finally(() =>
                  setIsWarningModalOpen(false)
                );
              }}
            >
              {t(
                'federation-dashboard.config.downloadBackup.acknowledgeButton'
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

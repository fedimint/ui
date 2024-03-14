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
  useTheme,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';
import { hexToBlob } from '../utils/api';

export const DownloadBackup: React.FC = () => {
  const theme = useTheme();
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
        <Button
          bg={theme.colors.red[500]}
          size={['sm', 'md']}
          _hover={{ bg: theme.colors.red[600] }}
          onClick={() => setIsWarningModalOpen(true)}
        >
          {t('federation-dashboard.danger-zone.downloadBackup.button')}
        </Button>
      </Flex>
      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t('federation-dashboard.danger-zone.downloadBackup.warningTitle')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t('federation-dashboard.danger-zone.downloadBackup.warningText')}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => setIsWarningModalOpen(false)}
            >
              {t('federation-dashboard.danger-zone.cancel')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => {
                handleConfirmDownload().finally(() =>
                  setIsWarningModalOpen(false)
                );
              }}
            >
              {t('federation-dashboard.danger-zone.acknowledge-and-download')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

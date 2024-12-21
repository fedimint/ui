import React from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  Text,
} from '@chakra-ui/react';
import { useGuardianAdminApi } from '../../hooks';
import { hexToBlob } from '../utils/api';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [hasDownloaded, setHasDownloaded] = React.useState(false);
  const api = useGuardianAdminApi();

  const handleDownload = async () => {
    try {
      const response = await api.downloadGuardianBackup();
      const blob = hexToBlob(response.tar_archive_bytes, 'application/x-tar');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'guardianBackup.tar');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setHasDownloaded(true);
    } catch (error) {
      console.error('Error downloading backup:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('federation-dashboard.danger-zone.backup.title')}
        </ModalHeader>
        <ModalBody>
          <Flex direction='column' gap={4}>
            <Alert status='warning'>
              <AlertIcon />
              <AlertTitle>
                {t('federation-dashboard.danger-zone.backup.warning-title')}
              </AlertTitle>
            </Alert>
            <Text>
              {t('federation-dashboard.danger-zone.backup.warning-text')}
            </Text>
            <Button
              colorScheme='blue'
              onClick={handleDownload}
              leftIcon={<DownloadIcon />}
              isDisabled={hasDownloaded}
            >
              {t('federation-dashboard.danger-zone.backup.acknowledgeButton')}
            </Button>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button isDisabled={!hasDownloaded} onClick={onClose}>
            {t('common.continue')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

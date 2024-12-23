import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  Text,
} from '@chakra-ui/react';
import { useGuardianAdminApi, useGuardianDispatch } from '../../hooks';
import { hexToBlob } from '../utils/api';
import { GUARDIAN_APP_ACTION_TYPE, GuardianStatus } from '../../types/guardian';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const api = useGuardianAdminApi();
  const dispatch = useGuardianDispatch();

  useEffect(() => {
    if (isOpen) {
      setHasDownloaded(false);
      setDownloadError(null);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      const response = await api.downloadGuardianBackup();
      const blob = hexToBlob(response.tar_archive_bytes, 'application/x-tar');
      const url = window.URL.createObjectURL(blob);

      await new Promise((resolve, reject) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'guardianBackup.tar');

        link.onclick = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            resolve(true);
          }, 1000);
        };

        link.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Download failed'));
        };

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      setHasDownloaded(true);
    } catch (error) {
      console.error('Error in handleDownload:', error);
      setDownloadError(
        t('federation-dashboard.danger-zone.backup.error-download')
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleContinue = () => {
    if (hasDownloaded) {
      dispatch({
        type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
        payload: GuardianStatus.Admin,
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader alignSelf='center'>
          {t('federation-dashboard.danger-zone.backup.title')}
        </ModalHeader>
        <ModalBody pb={6}>
          <Flex direction='column' gap={4}>
            <Alert status='warning'>
              <AlertIcon />
              <AlertTitle>
                {t('federation-dashboard.danger-zone.backup.warning-title')}
              </AlertTitle>
            </Alert>
            <Text mb={4}>
              {t('federation-dashboard.danger-zone.backup.warning-text')}
            </Text>
            {downloadError && (
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle>{downloadError}</AlertTitle>
              </Alert>
            )}
            <Flex justifyContent='center' gap={4} direction={['column', 'row']}>
              <Button
                variant='ghost'
                size={['sm', 'md']}
                onClick={handleDownload}
                isDisabled={hasDownloaded || isDownloading}
                isLoading={isDownloading}
                bg='red.500'
                color='white'
                _hover={{ bg: 'red.600' }}
                _active={{ bg: 'red.700' }}
              >
                {t('federation-dashboard.danger-zone.acknowledge-and-download')}
              </Button>
              <Button
                colorScheme='blue'
                size={['sm', 'md']}
                onClick={handleContinue}
                isDisabled={!hasDownloaded}
              >
                {t('common.close')}
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

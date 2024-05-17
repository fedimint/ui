import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Flex,
  useTheme,
  Card,
  CardHeader,
  CardBody,
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
      <Button
        size={['sm', 'md']}
        bg={theme.colors.red[500]}
        _hover={{ bg: theme.colors.red[600] }}
        onClick={() => setIsWarningModalOpen(true)}
      >
        {t('federation-dashboard.danger-zone.downloadBackup.title')}
      </Button>
      <Card flex='1'>
        <CardHeader>
          <Text size='lg' fontWeight='600'>
            {t('federation-dashboard.config.backup.label')}
          </Text>
        </CardHeader>
        <CardBody>
          <Button
            colorScheme='blue'
            onClick={() => setIsWarningModalOpen(true)}
          >
            {t('federation-dashboard.config.backup.download-backup-button')}
          </Button>
        </CardBody>
      </Card>
      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader alignSelf='center'>
            {t('federation-dashboard.danger-zone.downloadBackup.title')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>
              {t('federation-dashboard.danger-zone.downloadBackup.warningText')}
            </Text>
            <Flex justifyContent='center' gap={4} direction={['column', 'row']}>
              <Button
                colorScheme='blue'
                mr={3}
                size={['sm', 'md']}
                onClick={() => setIsWarningModalOpen(false)}
              >
                {t('federation-dashboard.danger-zone.cancel')}
              </Button>
              <Button
                variant='ghost'
                size={['sm', 'md']}
                onClick={() => {
                  handleConfirmDownload().finally(() =>
                    setIsWarningModalOpen(false)
                  );
                }}
              >
                {t('federation-dashboard.danger-zone.acknowledge-and-download')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

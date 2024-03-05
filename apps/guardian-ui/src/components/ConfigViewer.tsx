import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { githubLight } from '@uiw/codemirror-theme-github';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { ClientConfig } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';
import { hexToBlob } from '../utils/api';

interface ConfigViewerProps {
  config: ClientConfig | undefined;
}

export const ConfigViewer: React.FC<ConfigViewerProps> = ({ config }) => {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const handleDownloadBackup = async () => {
    setIsWarningModalOpen(true);
  };

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
      <Card flex='1'>
        <CardHeader>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text size='lg' fontWeight='600'>
              {t('federation-dashboard.config.label')}
            </Text>
            <Button onClick={handleDownloadBackup}>
              {t('federation-dashboard.config.downloadBackup.button')}
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <CodeMirror
            value={JSON.stringify(config, null, 2)}
            theme={githubLight}
            extensions={[json()]}
            basicSetup={{ autocompletion: true }}
            minWidth={'500px'}
            minHeight={'500px'}
            readOnly
          />
        </CardBody>
      </Card>
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
            <Button variant='ghost' onClick={handleConfirmDownload}>
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

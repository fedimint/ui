import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { formatEllipsized, useTranslation } from '@fedimint/utils';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { githubLight } from '@uiw/codemirror-theme-github';
import { GatewayClientConfig } from '@fedimint/types';

interface ViewConfigModalProps {
  federationId: string;
  config: GatewayClientConfig;
}

export const ViewConfigModal: React.FC<ViewConfigModalProps> = ({
  federationId,
  config,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  return (
    <>
      <Button size='xs' onClick={onOpen} variant='link' colorScheme='blue'>
        {t('federation-card.view-config')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t('federation-card.config-for', {
              federationId: formatEllipsized(federationId),
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CodeMirror
              value={JSON.stringify(config, null, 2)}
              theme={githubLight}
              extensions={[json()]}
              basicSetup={{ autocompletion: true }}
              width='100%'
              height='500px'
              readOnly
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

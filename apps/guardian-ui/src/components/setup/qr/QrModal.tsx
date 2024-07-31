import React from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Button,
  useClipboard,
} from '@chakra-ui/react';
import QRCode from 'qrcode.react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  header: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  content,
  header,
}) => {
  const { onCopy, hasCopied } = useClipboard(content);

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display='flex'
          justifyContent='center'
          alignItems='center'
          pb={8}
        >
          <Flex direction='column' alignItems='center' gap={4}>
            <QRCode value={content} size={256} />
            <Flex alignItems='center' gap={2}>
              <Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

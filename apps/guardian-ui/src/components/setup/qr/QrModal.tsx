import React from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Flex,
  Button,
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
  const toast = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to copy content: ', error);
      toast({
        title: 'Copy Error',
        description: 'Failed to copy content. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
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
            <Button onClick={handleCopy}>Copy</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

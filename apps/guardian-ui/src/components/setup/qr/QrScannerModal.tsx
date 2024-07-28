import React from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Button,
  Flex,
} from '@chakra-ui/react';
import { Scanner } from './Scanner';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  title?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  title = 'Scan QR Code',
}) => {
  const toast = useToast();

  const handleScan = (data: string) => {
    onScan(data);
    onClose();
  };
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleScan(text);
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
      toast({
        title: 'Paste Error',
        description: 'Failed to read clipboard contents. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleError = (error: string) => {
    console.error(error);
    if (error.includes('play() request was interrupted')) {
      toast({
        title: 'Scanner Error',
        description: 'The camera stream was interrupted. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display='flex'
          justifyContent='center'
          alignItems='center'
          pb={8}
        >
          <Flex direction='column' width='100%' alignItems='center' gap={4}>
            <Scanner
              scanning={isOpen}
              onResult={handleScan}
              onError={(e) => handleError(e.toString())}
              style={{ width: '100%', height: 'auto' }}
            />
            <Button onClick={handlePaste}>Paste</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

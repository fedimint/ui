import React from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
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
          <Scanner
            scanning={isOpen}
            onResult={handleScan}
            onError={(e) => handleError(e.toString())}
            style={{ width: '100%', height: 'auto' }}
          />
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

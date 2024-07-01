import React from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { Scanner } from './Scanner';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const handleScan = (data: string) => {
    onScan(data);
    onClose();
  };

  const handleError = (error: string) => {
    console.error(error);
  };

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan QR Code</ModalHeader>
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

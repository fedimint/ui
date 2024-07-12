import React from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
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
          <QRCode value={content} size={256} />
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

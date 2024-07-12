import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface ConfirmFollowersConnectedProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleNext: () => void;
}

export const ConfirmFollowersConnected: React.FC<
  ConfirmFollowersConnectedProps
> = ({ isOpen, setIsOpen, handleNext }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Heading size='md' mb={4}>
            {t('common.confirm')}
          </Heading>
          <Text mb={4}>
            {t('setup.progress.verify-guardians.leader-confirm-done')}
          </Text>
          <Text fontWeight='bold' textDecoration='underline'>
            {t('setup.progress.verify-guardians.leader-confirm-done-emphasis')}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={() => {
              setIsOpen(false);
              handleNext();
            }}
          >
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

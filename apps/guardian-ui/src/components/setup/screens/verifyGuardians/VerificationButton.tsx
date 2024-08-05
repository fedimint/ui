import React, { useState } from 'react';
import {
  Button,
  Icon,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ReactComponent as ArrowRightIcon } from '../../../../assets/svgs/arrow-right.svg';
import { GuardianRole } from '../../../../types';

interface VerificationButtonProps {
  verifiedConfigs: boolean;
  isStarting: boolean;
  role: GuardianRole;
  handleNext: () => void;
}

export const VerificationButton: React.FC<VerificationButtonProps> = ({
  verifiedConfigs,
  isStarting,
  role,
  handleNext,
}) => {
  const { t } = useTranslation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClick = () => {
    if (role === GuardianRole.Host) {
      setIsConfirmOpen(true);
    } else {
      handleNext();
    }
  };

  return (
    <>
      <Flex direction='row' gap={4} align='center' width='full'>
        <Button
          isDisabled={!verifiedConfigs}
          isLoading={isStarting}
          onClick={handleClick}
          leftIcon={<Icon as={ArrowRightIcon} />}
          width={{ base: 'full', sm: 'auto' }}
        >
          {t('common.next')}
        </Button>
      </Flex>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
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
              {t(
                'setup.progress.verify-guardians.leader-confirm-done-emphasis'
              )}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => {
                setIsConfirmOpen(false);
                handleNext();
              }}
            >
              {t('common.confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

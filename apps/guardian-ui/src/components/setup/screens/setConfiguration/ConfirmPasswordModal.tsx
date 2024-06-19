import React from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

interface ConfirmPasswordModalProps {
  password: string;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  submitConfig: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmPasswordModal: React.FC<ConfirmPasswordModalProps> = ({
  password,
  confirmPassword,
  setConfirmPassword,
  submitConfig,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('set-config.confirm-password')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>{t('set-config.confirm-password')}</FormLabel>
            <Input
              type='password'
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.currentTarget.value)}
              placeholder='Confirm Password'
            />
            {password !== confirmPassword && (
              <FormHelperText color='red'>
                {t('set-config.error-password-mismatch')}
              </FormHelperText>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Flex justifyContent='flex-start' width='100%'>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => {
                if (password === confirmPassword) {
                  onClose();
                  submitConfig();
                }
              }}
              isDisabled={password !== confirmPassword}
            >
              {t('common.next')}
            </Button>
            <Button variant='ghost' onClick={onClose}>
              {t('common.back')}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

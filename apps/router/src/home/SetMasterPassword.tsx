import React, { useState } from 'react';
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useMasterPassword } from '../hooks/useMasterPassword';

interface SetMasterPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetMasterPassword: React.FC<SetMasterPasswordProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { setMasterPassword } = useMasterPassword();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError(t('home.master-password.password-mismatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('home.master-password.password-too-short'));
      return;
    }
    setMasterPassword(password);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('home.master-password.set-master-password')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection='column' alignItems='stretch' gap={4}>
            <Alert status='info'>
              <AlertIcon />
              {t('home.master-password.master-password-explainer')}
            </Alert>
            <FormControl isInvalid={!!error}>
              <FormLabel>{t('home.master-password.master-password')}</FormLabel>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('home.master-password.create-master-password')}
              />
            </FormControl>
            <FormControl isInvalid={!!error}>
              <FormLabel>
                {t('home.master-password.confirm-master-password')}
              </FormLabel>
              <Input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('home.master-password.confirm-master-password')}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' onClick={handleSubmit}>
            {t('home.master-password.set-master-password')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

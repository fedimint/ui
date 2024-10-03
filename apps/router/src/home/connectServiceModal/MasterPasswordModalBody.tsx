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
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useMasterPassword } from '../../hooks/useMasterPassword';

export const MasterPasswordModalBody: React.FC = () => {
  const { t } = useTranslation();
  const { setMasterPassword } = useMasterPassword();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError(t('home.connect-service-modal.password-mismatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('home.connect-service-modal.password-too-short'));
      return;
    }
    setMasterPassword(password);
  };

  return (
    <Flex flexDirection='column' alignItems='stretch' gap={4}>
      <Alert status='info'>
        <AlertIcon />
        {t('home.connect-service-modal.master-password-explainer')}
      </Alert>
      <FormControl isInvalid={!!error}>
        <FormLabel>{t('home.connect-service-modal.master-password')}</FormLabel>
        <Input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('home.connect-service-modal.enter-master-password')}
        />
      </FormControl>
      <FormControl isInvalid={!!error}>
        <FormLabel>
          {t('home.connect-service-modal.confirm-master-password')}
        </FormLabel>
        <Input
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('home.connect-service-modal.confirm-master-password')}
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Button colorScheme='blue' onClick={handleSubmit}>
        {t('home.connect-service-modal.set-master-password')}
      </Button>
    </Flex>
  );
};

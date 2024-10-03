import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { AuthContext } from '../context/AuthContext';
import { useMasterPassword } from '../hooks/useMasterPassword';
import { decrypt } from '../utils/crypto'; // Assuming you have this utility function

export const EnterMasterPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const { test } = useContext(AuthContext);
  const { setMasterPassword } = useMasterPassword();
  const toast = useToast();

  const handleUnlock = async () => {
    if (test) {
      try {
        const decryptedTest = await decrypt(test, password);
        if (decryptedTest !== 'test') {
          throw new Error('Invalid password');
        }
        setMasterPassword(decryptedTest);
        toast({
          title: t('home.master-password.unlock-success'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: t('home.master-password.unlock-error'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>{t('home.master-password.enter')}</FormLabel>
        <Input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('home.master-password.placeholder')}
        />
      </FormControl>
      <Button mt={4} colorScheme='blue' onClick={handleUnlock}>
        {t('home.master-password.unlock')}
      </Button>
    </Box>
  );
};

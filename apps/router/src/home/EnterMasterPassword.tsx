import React, { useCallback, useState, useContext } from 'react';
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useTranslation } from '@fedimint/utils';
import { AuthContext } from '../context/AuthContext';
import { useMasterPassword } from '../hooks/useMasterPassword';
import { decrypt } from '../utils/crypto';

export const EnterMasterPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { test } = useContext(AuthContext);
  const { setMasterPassword } = useMasterPassword();

  const handleUnlock = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      if (!test) {
        setError(t('home.master-password.no-test-data'));
        return;
      }

      setLoading(true);
      try {
        console.log('test', test);
        console.log('password', password);
        const decryptedTest = await decrypt(password, test);
        console.log('decryptedTest', decryptedTest);
        if (decryptedTest !== 'test') {
          throw new Error('Invalid password');
        }
        setMasterPassword(password);
        setError('');
        console.log('Unlock successful');
      } catch (error) {
        setError(t('home.master-password.unlock-error'));
      } finally {
        setLoading(false);
      }
    },
    [password, test, setMasterPassword, t]
  );

  return (
    <form onSubmit={handleUnlock}>
      <Flex direction='column' pt={8} gap={4} align='start' justify='start'>
        <FormControl isInvalid={!!error} maxW='480px'>
          <FormLabel>
            {t('home.master-password.enter-master-password')}
          </FormLabel>
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder={t('home.master-password.enter-master-password')}
            />
            <InputRightElement onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </InputRightElement>
          </InputGroup>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
        <Button isLoading={loading} type='submit' colorScheme='blue'>
          {t('home.master-password.unlock-services')}
        </Button>
      </Flex>
    </form>
  );
};

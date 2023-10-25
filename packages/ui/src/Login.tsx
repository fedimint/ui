import React, { useCallback, useState } from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  FormErrorMessage,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

interface LoginProps {
  checkAuth: (password?: string) => Promise<boolean>;
  setAuthenticated: () => void;
  parseError: (err: unknown) => string;
}

export const Login: React.FC<LoginProps> = ({
  checkAuth,
  setAuthenticated,
  parseError,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        const isValid = await checkAuth(password);
        if (isValid) {
          setAuthenticated();
        } else {
          setError('Invalid password');
        }
      } catch (err: unknown) {
        console.error({ err });
        setError(parseError(err));
      }
    },
    [password, checkAuth, setAuthenticated, parseError]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack pt={8} gap={2} align='start' justify='start'>
        <VStack align='start' gap={2}>
          <Heading size='md' fontWeight='medium'>
            {t('login.title')}
          </Heading>
          <Text size='md' fontWeight='medium'>
            {t('login.subtitle')}
          </Text>
        </VStack>
        <FormControl isInvalid={!!error}>
          <FormLabel>{t('login.password')}</FormLabel>
          <Input
            type='password'
            value={password}
            onChange={(ev) => setPassword(ev.currentTarget.value)}
          />
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
        <Button type='submit'>{t('login.submit')}</Button>
      </VStack>
    </form>
  );
};

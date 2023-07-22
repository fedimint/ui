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
import { useAppContext } from '../hooks';
import { formatApiErrorMessage } from '../utils/api';
import { APP_ACTION_TYPE } from '../types';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { api, dispatch } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        const isValid = await api.testPassword(password);
        if (isValid) {
          dispatch({ type: APP_ACTION_TYPE.SET_NEEDS_AUTH, payload: false });
        } else {
          setError('Invalid password');
        }
      } catch (err: unknown) {
        console.error({ err });
        setError(formatApiErrorMessage(err));
      }
    },
    [api, password]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack pt={8} gap={2} align='start' justify='start'>
        <VStack align='start' gap={2}>
          <Heading size='md' fontWeight='medium'>
            {t('setup.auth.title')}
          </Heading>
          <Text size='md' fontWeight='medium'>
            {t('setup.auth.subtitle')}
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

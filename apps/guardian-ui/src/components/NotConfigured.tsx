import React, { useCallback, useState } from 'react';
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { GuardianApi } from '../GuardianApi';
import { APP_ACTION_TYPE, Status, AppAction } from '../types';

interface NotConfiguredProps {
  api: GuardianApi;
  dispatch: React.Dispatch<AppAction>;
}

export const NotConfigured: React.FC<NotConfiguredProps> = ({
  api,
  dispatch,
}) => {
  const { t } = useTranslation();
  const [configUrl, setConfigUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
        await api.setGuardianConfig({ fm_config_api: configUrl });
        dispatch({ type: APP_ACTION_TYPE.SET_STATUS, payload: Status.Loading });
      } catch (err) {
        setError(t('errors.invalidConfig'));
      }
    },
    [api, configUrl, dispatch, t]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column' pt={8} gap={4} align='start' justify='start'>
        <Flex direction='column' align='start' gap={4}>
          <Heading size='md' fontWeight='medium'>
            {t('notConfigured.title')}
          </Heading>
          <Text size='md' fontWeight='medium'>
            {t('notConfigured.description')}
          </Text>
        </Flex>
        <FormControl isInvalid={!!error}>
          <FormLabel>{t('notConfigured.urlLabel')}</FormLabel>
          <Input
            placeholder={t('notConfigured.urlPlaceholder')}
            value={configUrl}
            onChange={(e) => setConfigUrl(e.target.value)}
          />
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
        <Button type='submit'>{t('common.submit')}</Button>
      </Flex>
    </form>
  );
};

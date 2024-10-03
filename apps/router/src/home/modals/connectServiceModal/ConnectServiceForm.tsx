import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ServiceInfoDisplay } from './ServiceInfoDisplay';
import { ServiceCheckResponse } from '../../../api/ServiceCheckApi';

interface ConnectServiceFormProps {
  configUrl: string;
  setConfigUrl: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  serviceInfo: ServiceCheckResponse | null;
  isLoading: boolean;
  error: string | null;
  requiresPassword: boolean;
  handleCheck: () => void;
  handleConfirm: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}

export const ConnectServiceForm: React.FC<ConnectServiceFormProps> = ({
  configUrl,
  setConfigUrl,
  password,
  setPassword,
  serviceInfo,
  isLoading,
  error,
  requiresPassword,
  handleCheck,
  handleConfirm,
  handleKeyPress,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {error && (
        <Text color='red.500' mb={4}>
          {error}
        </Text>
      )}
      <FormControl isInvalid={!!error}>
        <FormLabel>{t('home.connect-service-modal.url-label')}</FormLabel>
        <Input
          placeholder='wss://fedimintd.domain.com:6000'
          value={configUrl}
          onChange={(e) => setConfigUrl(e.target.value)}
        />
      </FormControl>
      {requiresPassword && (
        <FormControl mt={4}>
          <FormLabel>{t('common.password')}</FormLabel>
          <Input
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Text fontSize='sm' color='gray.500' mt={1}>
            {t('home.connect-service-modal.valid-service-password-hint')}
          </Text>
        </FormControl>
      )}
      {!serviceInfo && (
        <Button
          mt={4}
          colorScheme='blue'
          onClick={handleCheck}
          isLoading={isLoading}
        >
          {t('common.check')}
        </Button>
      )}
      {serviceInfo && (
        <>
          <Divider my={6} />
          <FormControl>
            <ServiceInfoDisplay serviceInfo={serviceInfo} />
          </FormControl>
          <Button mt={4} colorScheme='green' onClick={handleConfirm}>
            {t('common.connect')}
          </Button>
        </>
      )}
    </>
  );
};

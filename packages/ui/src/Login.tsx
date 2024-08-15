import React, { useCallback, useState } from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  Button,
  Flex,
  FormErrorMessage,
  Heading,
  Text,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setLoading(true);
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
      setLoading(false);
    },
    [password, checkAuth, setAuthenticated, parseError]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column' pt={8} gap={4} align='start' justify='start'>
        <Flex direction='column' align='start' gap={4}>
          <Heading size='md' fontWeight='medium'>
            {t('login.title')}
          </Heading>
          <Text size='md' fontWeight='medium'>
            {t('login.subtitle')}
          </Text>
        </Flex>
        <FormControl isInvalid={!!error}>
          <FormLabel>{t('login.password')}</FormLabel>
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(ev) => setPassword(ev.currentTarget.value)}
            />
            <InputRightElement onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </InputRightElement>
          </InputGroup>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
        <Button isLoading={loading} type='submit'>
          {t('login.submit')}
        </Button>
      </Flex>
    </form>
  );
};

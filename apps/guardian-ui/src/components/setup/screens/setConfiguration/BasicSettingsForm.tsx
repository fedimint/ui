import React from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Flex,
  Button,
  Text,
  useTheme,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FormGroup } from '@fedimint/ui';
import { ReactComponent as LightbulbLogo } from '../../../../assets/svgs/lightbulb.svg';
import { generatePassword } from '../../../../utils';

interface BasicSettingsFormProps {
  myName: string;
  setMyName: (name: string) => void;
  password: string | null;
  setPassword: (password: string) => void;
}

export const BasicSettingsForm: React.FC<BasicSettingsFormProps> = ({
  myName,
  setMyName,
  password,
  setPassword,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <FormGroup
      icon={LightbulbLogo}
      title={`${t('set-config.basic-settings')}`}
      isOpen={true}
    >
      <FormControl>
        <FormLabel>{t('set-config.guardian-name')}</FormLabel>
        <Input
          value={myName}
          onChange={(ev) => setMyName(ev.currentTarget.value)}
        />
        <FormHelperText>{t('set-config.guardian-name-help')}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('set-config.admin-password')}</FormLabel>
        {password === null ? (
          <Button onClick={() => setPassword(generatePassword())} w='100%'>
            {t('set-config.admin-password-generate')}
          </Button>
        ) : (
          <Flex gap={2}>
            <Input
              type='text'
              value={password}
              placeholder='Password'
              onChange={(ev) => setPassword(ev.currentTarget.value)}
            />
          </Flex>
        )}
        <FormHelperText style={{ marginTop: '16px', marginBottom: '16px' }}>
          <Text color={theme.colors.yellow[500]}>
            {password === null
              ? t('set-config.admin-password-set')
              : t('set-config.admin-password-help')}
          </Text>
        </FormHelperText>
      </FormControl>
    </FormGroup>
  );
};

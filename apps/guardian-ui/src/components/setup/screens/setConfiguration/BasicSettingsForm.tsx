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

interface BasicSettingsFormProps {
  myName: string;
  setMyName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  hasCopied: boolean;
  onCopy: () => void;
  isFollower: boolean;
  hostServerUrl: string;
  setHostServerUrl: (url: string) => void;
}

export const BasicSettingsForm: React.FC<BasicSettingsFormProps> = ({
  myName,
  setMyName,
  password,
  setPassword,
  hasCopied,
  onCopy,
  isFollower,
  hostServerUrl,
  setHostServerUrl,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const generateAndSetPassword = () => {
    const getRandomInt = (max: number) => {
      const randomBuffer = new Uint8Array(1);
      window.crypto.getRandomValues(randomBuffer);
      return Math.floor((randomBuffer[0] / 255) * max);
    };

    const passwordLength = 16;
    const charSet = 'abcdefghjkmnpqrstuvwxyz0123456789';

    let adminPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = getRandomInt(charSet.length);
      adminPassword += charSet.charAt(randomIndex);
    }

    setPassword(adminPassword);
  };

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
        {password ? (
          <Flex gap={2}>
            <Input
              type='text'
              value={password}
              w='80%'
              placeholder='Password'
              onChange={(ev) => setPassword(ev.currentTarget.value)}
            />
            <Button onClick={onCopy} w='20%'>
              {hasCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </Flex>
        ) : (
          <Button onClick={generateAndSetPassword} w='100%'>
            {t('set-config.admin-password-generate')}
          </Button>
        )}
        <FormHelperText style={{ marginTop: '16px', marginBottom: '16px' }}>
          <Text color={theme.colors.yellow[500]}>
            {password
              ? t('set-config.admin-password-help')
              : t('set-config.admin-password-set')}
          </Text>
        </FormHelperText>
      </FormControl>
      {isFollower && (
        <FormControl>
          <FormLabel>{t('set-config.join-federation')}</FormLabel>
          <Input
            value={hostServerUrl}
            onChange={(ev) => setHostServerUrl(ev.currentTarget.value)}
            placeholder='ws://...'
          />
          <FormHelperText>
            {t('set-config.join-federation-help')}
          </FormHelperText>
        </FormControl>
      )}
    </FormGroup>
  );
};

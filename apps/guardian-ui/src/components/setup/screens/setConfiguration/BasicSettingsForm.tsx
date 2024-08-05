import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Flex,
  Button,
  Text,
  useTheme,
  Icon,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FormGroup } from '@fedimint/ui';
import { ReactComponent as LightbulbLogo } from '../../../../assets/svgs/lightbulb.svg';
import { ReactComponent as ScanIcon } from '../../../../assets/svgs/scan.svg';
import { generatePassword } from '../../../../utils';
import { QrScannerModal } from '../../qr/QrScannerModal';

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
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

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
          <Button onClick={() => setPassword(generatePassword())} w='100%'>
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
          <InputGroup>
            <Input
              value={hostServerUrl}
              onChange={(ev) => setHostServerUrl(ev.currentTarget.value)}
              placeholder='ws://...'
              pr='4.5rem'
            />
            <InputRightElement width='4.5rem'>
              <Icon
                as={ScanIcon}
                cursor='pointer'
                onClick={() => setIsQrScannerOpen(true)}
                boxSize='1.5rem'
                color='gray.500'
                _hover={{ color: 'blue.500' }}
              />
            </InputRightElement>
          </InputGroup>
          <FormHelperText>
            {t('set-config.join-federation-help')}
          </FormHelperText>
        </FormControl>
      )}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScan={(data) => setHostServerUrl(data)}
      />
    </FormGroup>
  );
};

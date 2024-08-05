import React from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Flex,
  Icon,
  Button,
  useTheme,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { CopyInput } from '@fedimint/ui';
import { ReactComponent as CopyIcon } from '../../../../assets/svgs/copy.svg';
import { ReactComponent as QrIcon } from '../../../../assets/svgs/qr.svg';
import { ReactComponent as ScanIcon } from '../../../../assets/svgs/scan.svg';

interface VerificationCodeInputProps {
  myHash: string;
  setQrModalOpen: (isOpen: boolean) => void;
  isScannerActive: boolean;
  setIsScannerActive: (isActive: boolean) => void;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  myHash,
  setQrModalOpen,
  isScannerActive,
  setIsScannerActive,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <FormControl bg={theme.colors.blue[50]} p={4} borderRadius='md' maxW='md'>
      <FormLabel>{t('verify-guardians.verification-code')}</FormLabel>
      <Flex direction='row' alignItems='center' gap='6px'>
        <CopyInput
          value={myHash}
          buttonLeftIcon={<Icon as={CopyIcon} />}
          size='sm'
        />
        <Icon
          as={QrIcon}
          cursor='pointer'
          onClick={() => setQrModalOpen(true)}
          bg='white'
          boxSize='40px'
          borderRadius='10%'
          border='1px solid lightgray'
          _hover={{ bg: 'gray.100' }}
        />
        <Button
          onClick={() => setIsScannerActive(!isScannerActive)}
          leftIcon={<Icon as={ScanIcon} />}
          size='sm'
          variant='outline'
          bg='white'
          borderColor='gray.200'
          _hover={{ bg: 'gray.100' }}
          color='black.700'
        >
          {isScannerActive
            ? t('verify-guardians.stop-scan')
            : t('verify-guardians.start-scan')}
        </Button>
      </Flex>
      <FormHelperText>
        {t('verify-guardians.verification-code-help')}
      </FormHelperText>
    </FormControl>
  );
};

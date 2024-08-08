import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ReactComponent as WarningIcon } from '../assets/svgs/warning.svg';

export const SetupWarning: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Flex alignSelf='flex-end' maxW={{ base: '100%', md: '50%' }}>
      <Alert status='warning' flexDirection='row'>
        <AlertIcon>
          <WarningIcon />
        </AlertIcon>
        <Box>
          <AlertTitle>{t('setup.warning.title')}</AlertTitle>
          <AlertDescription display={{ base: 'none', md: 'block' }}>
            {t('setup.warning.description')}
          </AlertDescription>
        </Box>
      </Alert>
    </Flex>
  );
};

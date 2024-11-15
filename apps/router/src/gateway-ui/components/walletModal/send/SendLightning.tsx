import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const SendLightning: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet-modal.send.lightning-instructions')}</Text>
      {/* TODO: actually implement this after we get fedimint side working*/}
    </Box>
  );
};

export default SendLightning;

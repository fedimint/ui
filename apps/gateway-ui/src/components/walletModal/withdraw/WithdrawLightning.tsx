import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const WithdrawLightning: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet.withdraw-lightning-instructions')}</Text>
      {/* Add more UI elements and logic for withdrawing via Lightning */}
    </Box>
  );
};

export default WithdrawLightning;

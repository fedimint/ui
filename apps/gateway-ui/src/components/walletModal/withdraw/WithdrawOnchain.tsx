import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const WithdrawOnchain: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet.withdraw-onchain-instructions')}</Text>
      {/* Add more UI elements and logic for withdrawing onchain */}
    </Box>
  );
};

export default WithdrawOnchain;

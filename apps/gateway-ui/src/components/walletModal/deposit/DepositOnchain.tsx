import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const DepositOnchain: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet.deposit-onchain-instructions')}</Text>
      {/* Add more UI elements and logic for depositing onchain */}
    </Box>
  );
};

export default DepositOnchain;

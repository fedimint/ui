import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const WithdrawEcash: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet.withdraw-ecash-instructions')}</Text>
      {/* Add more UI elements and logic for withdrawing ecash */}
    </Box>
  );
};

export default WithdrawEcash;

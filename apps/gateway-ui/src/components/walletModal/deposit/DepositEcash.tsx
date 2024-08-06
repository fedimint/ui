import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const DepositEcash: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet.deposit-ecash-instructions')}</Text>
      {/* Add more UI elements and logic for depositing ecash */}
    </Box>
  );
};

export default DepositEcash;

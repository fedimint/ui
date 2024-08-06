import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const DepositLightning: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet.deposit-lightning-instructions')}</Text>
      {/* Add more UI elements and logic for depositing via Lightning */}
    </Box>
  );
};

export default DepositLightning;

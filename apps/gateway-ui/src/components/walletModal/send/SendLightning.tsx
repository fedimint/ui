import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';

interface SendLightningProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const SendLightning: React.FC<SendLightningProps> = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet-modal.send.lightning-instructions')}</Text>
      {/* Add more UI elements and logic for withdrawing via Lightning */}
    </Box>
  );
};

export default SendLightning;

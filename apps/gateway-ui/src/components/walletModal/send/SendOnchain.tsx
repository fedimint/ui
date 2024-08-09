import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { WalletModalState } from '../WalletModal';
import { FederationInfo } from '@fedimint/types';

interface SendOnchainProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const SendOnchain: React.FC<SendOnchainProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet-modal.send.onchain-instructions')}</Text>
      {/* Add more UI elements and logic for withdrawing onchain */}
    </Box>
  );
};

export default SendOnchain;

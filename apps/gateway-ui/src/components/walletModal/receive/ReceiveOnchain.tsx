import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';

interface ReceiveOnchainProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const ReceiveOnchain: React.FC<ReceiveOnchainProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet-modal.receive.onchain-instructions')}</Text>
      {/* Add more UI elements and logic for depositing onchain */}
    </Box>
  );
};

export default ReceiveOnchain;

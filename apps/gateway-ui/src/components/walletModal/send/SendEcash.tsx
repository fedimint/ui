import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
interface SendEcashProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const SendEcash: React.FC<SendEcashProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text>{t('wallet-modal.send.ecash-instructions')}</Text>
      {/* Add more UI elements and logic for withdrawing ecash */}
    </Box>
  );
};

export default SendEcash;

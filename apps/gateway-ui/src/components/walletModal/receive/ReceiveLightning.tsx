import React, { useState } from 'react';
import {
  Box,
  Text,
  NumberInput,
  NumberInputField,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';

interface ReceiveLightningProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const ReceiveLightning: React.FC<ReceiveLightningProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | ''>(0);

  const handleCreateInvoice = () => {
    // TODO: Implement invoice creation logic
    console.log('Creating invoice for', amount, 'sats');
  };

  return (
    <Box>
      <Text mb={4}>{t('wallet-modal.receive.lightning-instructions')}</Text>
      <NumberInput
        value={amount}
        onChange={(_, value) => setAmount(value)}
        min={0}
      >
        <NumberInputField
          placeholder={t('wallet-modal.receive.enter-amount-sats')}
          height='60px'
          fontSize='md'
        />
      </NumberInput>
      <Button onClick={handleCreateInvoice} size='lg' width='100%'>
        {t('wallet-modal.receive.create-invoice')}
      </Button>
    </Box>
  );
};

export default ReceiveLightning;

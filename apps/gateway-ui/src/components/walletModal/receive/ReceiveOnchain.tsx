import React, { useState } from 'react';
import { NumberInput, NumberInputField, Button, Flex } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import FederationSelector from '../FederationSelector';

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
  const [amount, setAmount] = useState<number | ''>(0);

  const handleCreateDepositAddress = () => {
    // TODO: Implement deposit address creation logic
    console.log('Creating deposit address for', amount, 'sats');
  };

  return (
    <Flex direction='column' gap={4}>
      <FederationSelector
        federations={federations}
        walletModalState={walletModalState}
        setWalletModalState={setWalletModalState}
      />
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
      <Button onClick={handleCreateDepositAddress} size='lg' width='100%'>
        {t('wallet-modal.receive.create-deposit-address')}
      </Button>
    </Flex>
  );
};

export default ReceiveOnchain;

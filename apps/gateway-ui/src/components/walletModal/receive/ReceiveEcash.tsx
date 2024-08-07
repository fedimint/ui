import React, { useState } from 'react';
import { Flex, Text, Textarea, Button } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';

interface ReceiveEcashProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const ReceiveEcash: React.FC<ReceiveEcashProps> = () => {
  const { t } = useTranslation();
  const [ecashNote, setEcashNote] = useState('');

  const handleRedeem = () => {
    // TODO: Implement redeem logic
    console.log('Redeeming ecash:', ecashNote);
  };

  return (
    <Flex direction='column' gap={4}>
      <Text>{t('wallet-modal.receive.ecash-instructions')}</Text>
      <Textarea
        placeholder={t('wallet-modal.receive.paste-ecash-placeholder')}
        value={ecashNote}
        onChange={(e) => setEcashNote(e.target.value)}
      />
      <Button onClick={handleRedeem} isDisabled={!ecashNote}>
        {t('wallet-modal.receive.redeem')}
      </Button>
    </Flex>
  );
};

export default ReceiveEcash;

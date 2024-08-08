import React, { useState } from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import { Scanner } from '@fedimint/ui';

interface ReceiveEcashProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const ReceiveEcash: React.FC<ReceiveEcashProps> = () => {
  const { t } = useTranslation();
  const [ecashNote, setEcashNote] = useState('');
  const [scanning, setScanning] = useState(true);

  const handleScanResult = (result: string) => {
    setEcashNote(result);
    setScanning(false);
  };

  const handleScanError = (
    error: string | React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    if (typeof error === 'string') {
      console.error('Scan error:', error);
    } else {
      console.error('Video error:', error);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEcashNote(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <Flex direction='column' gap={4}>
      <Scanner
        scanning={scanning}
        onResult={handleScanResult}
        onError={handleScanError}
      />
      <Button onClick={handlePaste}>
        {t('wallet-modal.receive.paste-ecash-button')}
      </Button>
    </Flex>
  );
};

export default ReceiveEcash;

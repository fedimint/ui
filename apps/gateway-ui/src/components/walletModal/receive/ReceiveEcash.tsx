import React, { useState } from 'react';
import { Flex, Text, Button, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import { QRReader, ScanResult } from '@fedimint/ui';

interface ReceiveEcashProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const ReceiveEcash: React.FC<ReceiveEcashProps> = () => {
  const { t } = useTranslation();
  const [ecashNote, setEcashNote] = useState('');
  const [showEcashInfo, setShowEcashInfo] = useState(false);
  const { onCopy: onCopyEcash, hasCopied } = useClipboard(ecashNote);

  const handleScanResult = (result: ScanResult) => {
    if (result.data) {
      setEcashNote(result.data);
      setShowEcashInfo(true);
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

  const handleRedeem = () => {
    console.log('Redeeming ecash note: ', ecashNote);
  };

  if (showEcashInfo) {
    return (
      <Flex direction='column' gap={4}>
        <Text fontWeight='bold'>{t('common.ecash-note')}</Text>
        <Text
          borderWidth={1}
          borderRadius='md'
          p={2}
          whiteSpace='pre-wrap'
          wordBreak='break-all'
        >
          {ecashNote}
        </Text>
        <Button onClick={onCopyEcash}>
          {hasCopied ? t('common.copied') : t('common.copy')}
        </Button>
        <Button onClick={handleRedeem}>
          {t('wallet-modal.receive.redeem-ecash-button')}
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <QRReader onScan={handleScanResult} />
      <Button onClick={handlePaste}>
        {t('wallet-modal.receive.paste-ecash-button')}
      </Button>
    </Flex>
  );
};

export default ReceiveEcash;

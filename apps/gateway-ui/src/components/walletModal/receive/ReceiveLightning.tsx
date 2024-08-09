import React, { useCallback, useState } from 'react';
import { Flex, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo, Sats } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import FederationSelector from '../FederationSelector';
import { ApiContext } from '../../../ApiProvider';
import { AmountInput, CreateButton, QRCodeTabs } from '..';

interface ReceiveLightningProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
  setShowSelector: (show: boolean) => void;
}

const ReceiveLightning: React.FC<ReceiveLightningProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
  setShowSelector,
}) => {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);
  const [amount, setAmount] = useState<Sats>(0 as Sats);
  const [invoice, setInvoice] = useState<string>();
  const [showInvoiceInfo, setShowInvoiceInfo] = useState(false);
  const { onCopy: onCopyInvoice } = useClipboard(invoice ?? '');

  const handleCreateInvoice = useCallback(() => {
    return;
  }, []);

  if (showInvoiceInfo) {
    const lightningUri = `lightning:${invoice}`;
    return (
      <QRCodeTabs
        uriValue={lightningUri}
        addressValue={invoice ?? ''}
        onCopyUri={onCopyInvoice}
        onCopyAddress={onCopyInvoice}
        uriLabel={t('common.uri')}
        addressLabel={t('common.invoice')}
      />
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <FederationSelector
        federations={federations}
        walletModalState={walletModalState}
        setWalletModalState={setWalletModalState}
      />
      <AmountInput amount={amount} setAmount={setAmount} />
      <CreateButton
        onClick={handleCreateInvoice}
        label={t('wallet-modal.receive.create-lightning-invoice')}
      />
    </Flex>
  );
};

export default ReceiveLightning;

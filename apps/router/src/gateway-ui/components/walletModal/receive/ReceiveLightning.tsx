import React, { useCallback, useState } from 'react';
import { Flex, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { IncomingContract, Sats } from '@fedimint/types';
import FederationSelector from '../FederationSelector';
import { useGatewayContext } from '../../../../hooks';
import { AmountInput } from '../../form/AmountInput';
import { CreateButton } from '../../form/CreateButton';
import { QRCodeTabs } from '../../form/QRTabs';

const ReceiveLightning: React.FC = () => {
  const { state, api } = useGatewayContext();

  const { t } = useTranslation();
  const [amount, setAmount] = useState<Sats>(0 as Sats);
  const [invoice, setInvoice] = useState<string>();
  const [showInvoiceInfo, setShowInvoiceInfo] = useState(false);
  const { onCopy: onCopyInvoice } = useClipboard(invoice ?? '');

  const handleCreateInvoice = useCallback(async () => {
    try {
      const incomingContract: IncomingContract = {
        commitment: 'test',
        ciphertext: 'test',
      };
      const invoice = await api.createBolt11InvoiceV2({
        federation_id:
          state.walletModalState.selectedFederation?.federation_id ?? '',
        contract: incomingContract,
        amount_msats: amount * 1000,
        description: `Lightning Invoice for ${amount} sats`,
        expiry_secs: Math.floor(Date.now() / 1000) + 3600,
      });
      setInvoice(invoice);
      setShowInvoiceInfo(true);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  }, [
    api,
    setShowInvoiceInfo,
    state.walletModalState.selectedFederation?.federation_id,
    amount,
  ]);

  if (showInvoiceInfo) {
    const lightningUri = `lightning:${invoice}`;
    return (
      <QRCodeTabs
        uriValue={lightningUri}
        addressValue={invoice ?? ''}
        onCopyUri={onCopyInvoice}
        onCopyAddress={onCopyInvoice}
        uriLabel={t('common.uri')}
        addressLabel={t('wallet.invoice')}
      />
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <FederationSelector />
      <AmountInput amount={amount} setAmount={setAmount} unit='sats' />
      <CreateButton
        onClick={handleCreateInvoice}
        label={t('wallet-modal.receive.create-lightning-invoice')}
      />
    </Flex>
  );
};

export default ReceiveLightning;

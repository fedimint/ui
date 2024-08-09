import React, { useCallback, useState } from 'react';
import { Flex, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Bip21Uri, FederationInfo, Sats } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import FederationSelector from '../FederationSelector';
import { ApiContext } from '../../../ApiProvider';
import { AmountInput, CreateButton, QRCodeTabs } from '..';

interface ReceiveOnchainProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
  setShowSelector: (show: boolean) => void;
}

const ReceiveOnchain: React.FC<ReceiveOnchainProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
  setShowSelector,
}) => {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);
  const [amount, setAmount] = useState<Sats>(0 as Sats);
  const [bip21Uri, setBip21Uri] = useState<Bip21Uri>();
  const [showAddressInfo, setShowAddressInfo] = useState(false);
  const { onCopy: onCopyUri } = useClipboard(bip21Uri?.toString() ?? '');
  const { onCopy: onCopyAddress } = useClipboard(bip21Uri?.address ?? '');

  const handleCreateDepositAddress = useCallback(() => {
    if (!walletModalState.selectedFederation) return;
    gateway
      .fetchPegInAddress(walletModalState.selectedFederation.federation_id)
      .then((newAddress) => {
        const bip21Uri = new Bip21Uri(newAddress, amount);
        setBip21Uri(bip21Uri);
        setShowSelector(false);
        setShowAddressInfo(true);
      })
      .catch(({ message, error }) => {
        console.error(error, message);
      });
  }, [gateway, walletModalState.selectedFederation, amount, setShowSelector]);

  if (showAddressInfo) {
    return (
      <QRCodeTabs
        uriValue={bip21Uri?.toString() ?? ''}
        addressValue={bip21Uri?.address ?? ''}
        onCopyUri={onCopyUri}
        onCopyAddress={onCopyAddress}
        uriLabel={t('common.uri')}
        addressLabel={t('common.address')}
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
        onClick={handleCreateDepositAddress}
        label={t('wallet-modal.receive.create-deposit-address')}
      />
    </Flex>
  );
};

export default ReceiveOnchain;

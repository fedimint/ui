import React, { useCallback, useState } from 'react';
import { Box, Flex, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo, Sats } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import FederationSelector from '../FederationSelector';
import { AmountInput, CreateButton, QRCodeTabs } from '..';
import { ApiContext } from '../../../ApiProvider';

interface SendEcashProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
  setShowSelector: (show: boolean) => void;
}

const SendEcash: React.FC<SendEcashProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
  setShowSelector,
}) => {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);
  const [amount, setAmount] = useState<Sats>(0 as Sats);
  const [ecash, setEcash] = useState<string>('');
  const [showEcash, setShowEcash] = useState<boolean>(false);
  const { onCopy: onCopyEcash } = useClipboard(ecash);

  const handleCreateEcash = useCallback(() => {
    if (!walletModalState.selectedFederation) return;
    gateway
      .spendEcash(walletModalState.selectedFederation.federation_id, amount)
      .then((newEcash) => {
        setEcash(newEcash);
        setShowSelector(false);
        setShowEcash(true);
      })
      .catch(({ message, error }) => {
        console.error(error, message);
      });
  }, [gateway, walletModalState.selectedFederation, amount, setShowSelector]);

  if (showEcash) {
    return (
      <QRCodeTabs
        uriValue={ecash}
        addressValue={ecash}
        onCopyUri={onCopyEcash}
        onCopyAddress={onCopyEcash}
        uriLabel={t('common.ecash')}
        addressLabel={t('common.ecash')}
      />
    );
  }

  return (
    <Box>
      <Flex direction='column' gap={4}>
        <FederationSelector
          federations={federations}
          walletModalState={walletModalState}
          setWalletModalState={setWalletModalState}
        />
        <AmountInput amount={amount} setAmount={setAmount} />
        <CreateButton
          onClick={handleCreateEcash}
          label={t('wallet-modal.send.create-ecash')}
        />
      </Flex>
    </Box>
  );
};

export default SendEcash;

import React, { useCallback, useState } from 'react';
import { Box, Flex, Text, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Sats } from '@fedimint/types';
import FederationSelector from '../FederationSelector';
import { AmountInput, CreateButton, QRCodeTabs } from '..';
import { useGatewayApi, useGatewayContext } from '../../../../context/hooks';

const SendEcash: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useGatewayContext();
  const api = useGatewayApi();
  const [amount, setAmount] = useState<Sats>(0 as Sats);
  const [ecash, setEcash] = useState<string>('');
  const [showEcash, setShowEcash] = useState<boolean>(false);
  const { onCopy: onCopyEcash } = useClipboard(ecash);

  const handleCreateEcash = useCallback(() => {
    if (!state.walletModalState.selectedFederation) return;
    api
      .spendEcash(
        state.walletModalState.selectedFederation.federation_id,
        amount
      )
      .then((newEcash) => {
        setEcash(newEcash);
        setShowEcash(true);
      })
      .catch(({ message, error }) => {
        console.error(error, message);
        alert(t('wallet-modal.send.ecash-error', { error: message }));
      });
  }, [api, state.walletModalState.selectedFederation, amount, t]);

  if (showEcash) {
    return (
      <Flex direction='column' gap={4} align='center'>
        <Text>
          {t('wallet-modal.send.ecash-created', {
            amount,
            federationName:
              state.walletModalState.selectedFederation?.config.global.meta
                .federation_name,
          })}
        </Text>
        <QRCodeTabs
          addressValue={ecash}
          onCopyAddress={onCopyEcash}
          addressLabel={t('common.ecash')}
        />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex direction='column' gap={4}>
        <FederationSelector />
        <AmountInput amount={amount} setAmount={setAmount} unit='msats' />
        <CreateButton
          onClick={handleCreateEcash}
          label={t('wallet-modal.send.create-ecash')}
        />
      </Flex>
    </Box>
  );
};

export default SendEcash;

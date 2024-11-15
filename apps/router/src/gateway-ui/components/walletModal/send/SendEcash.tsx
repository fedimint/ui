import React, { useCallback, useState } from 'react';
import { Box, Flex, Text, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Sats } from '@fedimint/types';
import FederationSelector from '../FederationSelector';
import { AmountInput, CreateButton, QRCodeTabs } from '..';
import {
  useGatewayApi,
  useGatewayDispatch,
  useGatewayState,
} from '../../../../hooks';
import { GATEWAY_APP_ACTION_TYPE } from '../../../../types/gateway';

const SendEcash: React.FC = () => {
  const { t } = useTranslation();
  const state = useGatewayState();
  const api = useGatewayApi();
  const dispatch = useGatewayDispatch();
  const [amount, setAmount] = useState<Sats>(0 as Sats);
  const [ecash, setEcash] = useState<string>('');
  const [showEcash, setShowEcash] = useState<boolean>(false);
  const { onCopy: onCopyEcash } = useClipboard(ecash);
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmount = (amount: Sats): boolean => {
    return amount > 0 && Number.isInteger(Number(amount));
  };

  const handleCreateEcash = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    if (!state.walletModalState.selectedFederation) {
      setIsLoading(false);
      return;
    }

    if (!isValidAmount(amount)) {
      dispatch({
        type: GATEWAY_APP_ACTION_TYPE.SET_ERROR,
        payload: t('wallet-modal.send.invalid-amount'),
      });
      setIsLoading(false);
      return;
    }

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
        dispatch({
          type: GATEWAY_APP_ACTION_TYPE.SET_ERROR,
          payload: message,
        });
      })
      .finally(() => setIsLoading(false));
  }, [
    api,
    state.walletModalState.selectedFederation,
    amount,
    t,
    dispatch,
    isLoading,
  ]);

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
          isLoading={isLoading}
        />
      </Flex>
    </Box>
  );
};

export default SendEcash;

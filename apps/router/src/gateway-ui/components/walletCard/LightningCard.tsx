import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useGatewayContext } from '../../../hooks';
import {
  GATEWAY_APP_ACTION_TYPE,
  WalletModalAction,
  WalletModalType,
} from '../../../types/gateway';

export const LightningCard = React.memo(function LightningCard(): JSX.Element {
  const { t } = useTranslation();
  const { state, dispatch } = useGatewayContext();

  const handleModalOpen = (action: WalletModalAction) => {
    const federations = state.gatewayInfo?.federations;
    if (!federations?.length) return;

    dispatch({
      type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
      payload: {
        action,
        type: WalletModalType.Lightning,
        selectedFederation: federations[0],
        showSelector: true,
        isOpen: true,
      },
    });
  };

  return (
    <Box p={6} bg='white' borderRadius='lg' borderWidth='1px' mb={4}>
      <Flex justify='space-between' align='center' mb={4}>
        <Text fontSize='xl'>{t('wallet.lightning-payments')}</Text>
        <Flex gap={2}>
          <Button
            leftIcon={<FaArrowDown />}
            colorScheme='blue'
            variant='solid'
            onClick={() => handleModalOpen(WalletModalAction.Receive)}
          >
            {t('wallet.receive')}
          </Button>
          <Button
            leftIcon={<FaArrowUp />}
            variant='outline'
            onClick={() => handleModalOpen(WalletModalAction.Send)}
          >
            {t('wallet.send')}
          </Button>
        </Flex>
      </Flex>
      <Text color='gray.600'>{t('wallet.lightning-payments-description')}</Text>
    </Box>
  );
});

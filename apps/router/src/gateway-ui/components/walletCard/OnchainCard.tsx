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

export const OnchainCard = React.memo(function OnchainCard(): JSX.Element {
  const { t } = useTranslation();
  const { state, dispatch } = useGatewayContext();

  const handleModalOpen = (action: WalletModalAction) => {
    const federations = state.gatewayInfo?.federations;
    if (!federations?.length) return;

    dispatch({
      type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
      payload: {
        action,
        type: WalletModalType.Onchain,
        selectedFederation: federations[0],
        showSelector: true,
        isOpen: true,
      },
    });
  };

  return (
    <Box p={6} bg='white' borderRadius='lg' borderWidth='1px'>
      <Text fontSize='xl' mb={6}>
        Onchain
      </Text>

      {/* Federation Balances Section */}
      <Box mb={6}>
        <Flex justify='space-between' align='center' mb={4}>
          <Text fontSize='md' fontWeight='medium'>
            {t('wallet.federation-balances')}
          </Text>
          <Flex gap={2}>
            <Button
              leftIcon={<FaArrowDown />}
              colorScheme='blue'
              variant='solid'
              onClick={() => handleModalOpen(WalletModalAction.Receive)}
            >
              {t('wallet.peg-in')}
            </Button>
            <Button
              leftIcon={<FaArrowUp />}
              variant='outline'
              onClick={() => handleModalOpen(WalletModalAction.Send)}
            >
              {t('wallet.peg-out')}
            </Button>
          </Flex>
        </Flex>
        <Text color='gray.600'>
          Deposit and withdraw bitcoin to/from the federation
        </Text>
      </Box>

      {/* Node's Onchain Wallet Section */}
      <Box>
        <Flex justify='space-between' align='center' mb={4}>
          <Text fontSize='md' fontWeight='medium'>
            {t('wallet.node-onchain-wallet')}
          </Text>
          <Flex gap={2}>
            <Button
              leftIcon={<FaArrowDown />}
              colorScheme='blue'
              variant='solid'
            >
              {t('wallet.receive')}
            </Button>
            <Button leftIcon={<FaArrowUp />} variant='outline'>
              {t('wallet.send')}
            </Button>
          </Flex>
        </Flex>
        <Text color='gray.600'>
          Manage bitcoin in the gateway&apos;s onchain wallet
        </Text>
      </Box>
    </Box>
  );
});

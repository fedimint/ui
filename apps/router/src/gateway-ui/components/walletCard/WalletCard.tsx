import React, { useMemo } from 'react';
import { Box, Button, Flex, Text, Square } from '@chakra-ui/react';
import { formatValue, useTranslation } from '@fedimint/utils';
import { MSats } from '@fedimint/types';
import { PieChart } from 'react-minimal-pie-chart';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
  GATEWAY_APP_ACTION_TYPE,
  WalletModalAction,
  WalletModalType,
} from '../../../types/gateway';
import { useGatewayContext } from '../../../hooks';
import { useBalanceCalculations } from '../../hooks/useBalanceCalculations';

export const WalletCard = React.memo(function WalletCard(): JSX.Element {
  const { t } = useTranslation();
  const { state, dispatch } = useGatewayContext();
  const balanceAmounts = useBalanceCalculations(state.balances ?? undefined);

  const balanceData = useMemo(
    () => [
      {
        title: t('wallet.ecash'),
        value: balanceAmounts.ecash,
        formattedValue: formatValue(
          balanceAmounts.ecash as MSats,
          state.unit,
          true
        ),
        color: '#FF6384',
      },
      {
        title: t('wallet.lightning'),
        value: balanceAmounts.lightning,
        formattedValue: formatValue(
          balanceAmounts.lightning as MSats,
          state.unit,
          true
        ),
        color: '#36A2EB',
      },
      {
        title: t('wallet.onchain'),
        value: balanceAmounts.onchain,
        formattedValue: formatValue(
          balanceAmounts.onchain as MSats,
          state.unit,
          true
        ),
        color: '#FFCE56',
      },
    ],
    [balanceAmounts, state.unit, t]
  );

  const totalBalance = useMemo(
    () => formatValue(balanceAmounts.total as MSats, state.unit, true),
    [balanceAmounts.total, state.unit]
  );

  const handleModalOpen = (action: WalletModalAction) => {
    const federations = state.gatewayInfo?.federations;
    if (!federations?.length) {
      console.error('No federations available');
      return;
    }
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
    <Flex
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      p={6}
    >
      {/* Balance section */}
      <Flex direction='column'>
        {balanceData.map((item) => (
          <Flex
            key={item.title}
            justify='space-between'
            mb={2}
            align='center'
            gap={8}
          >
            <Flex align='center'>
              <Square size='12px' bg={item.color} mr={2} />
              <Text fontSize='md' color='gray.600'>
                {item.title}:
              </Text>
            </Flex>
            <Text fontSize='md' fontWeight='semibold'>
              {item.formattedValue}
            </Text>
          </Flex>
        ))}
        <Box borderTop='1px' borderColor='gray.200' mt={4} pt={2}>
          <Flex justify='space-between'>
            <Text fontSize='md' fontWeight='bold'>
              {t('wallet.total')}:
            </Text>
            <Text fontSize='md' fontWeight='bold'>
              {totalBalance}
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Pie chart section */}
      <Box width='150px' height='150px' position='relative'>
        <PieChart
          data={balanceData}
          lineWidth={40}
          paddingAngle={2}
          startAngle={-90}
          animate
        />
      </Box>

      {/* Deposit/Withdraw section */}
      <Flex direction='column' width='150px'>
        <Button
          leftIcon={<FaArrowDown />}
          colorScheme='blue'
          size='md'
          mb={4}
          onClick={() => handleModalOpen(WalletModalAction.Receive)}
          width='100%'
        >
          {t('wallet.receive')}
        </Button>
        <Button
          leftIcon={<FaArrowUp />}
          colorScheme='blue'
          size='md'
          variant='outline'
          onClick={() => handleModalOpen(WalletModalAction.Send)}
          width='100%'
        >
          {t('wallet.send')}
        </Button>
      </Flex>
    </Flex>
  );
});

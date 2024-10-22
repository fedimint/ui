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
import { useGatewayContext } from '../../../context/hooks';

export const WalletCard = React.memo(function WalletCard(): JSX.Element {
  const { t } = useTranslation();
  const { state, dispatch } = useGatewayContext();

  const balanceData = useMemo(
    // Structure the data for the pie chart:
    // title, value: balance_msats, formattedValue, color
    () => [
      {
        title: t('wallet.ecash'),
        value:
          state.balances?.ecash_balances.reduce(
            (total, item) => total + item.ecash_balance_msats,
            0
          ) ?? 0,
        formattedValue: formatValue(
          state.balances?.ecash_balances.reduce(
            (total, item) => total + item.ecash_balance_msats,
            0
          ) as MSats,
          state.unit,
          true
        ),
        color: '#FF6384',
      },
      {
        title: t('wallet.lightning'),
        value: state.balances?.lightning_balance_msats ?? 0,
        formattedValue: formatValue(
          state.balances?.lightning_balance_msats as MSats,
          state.unit,
          true
        ),
        color: '#36A2EB',
      },
      {
        title: t('wallet.onchain'),
        value: (state.balances?.onchain_balance_sats ?? 0) * 1000,
        formattedValue: formatValue(
          ((state.balances?.onchain_balance_sats ?? 0) * 1000) as MSats,
          state.unit,
          true
        ),
        color: '#FFCE56',
      },
    ],
    [state, t]
  );

  const totalBalance = useMemo(() => {
    return formatValue(
      balanceData.reduce(
        (total, item: { value?: number }) => total + (item.value ?? 0),
        0
      ) as MSats,
      state.unit,
      true
    );
  }, [balanceData, state.unit]);

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
          onClick={() => {
            dispatch({
              type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
              payload: {
                action: WalletModalAction.Receive,
                type: WalletModalType.Onchain,
                selectedFederation: state.gatewayInfo?.federations[0] ?? null,
                showSelector: true,
                isOpen: true,
              },
            });
          }}
          width='100%'
        >
          {t('wallet.receive')}
        </Button>
        <Button
          leftIcon={<FaArrowUp />}
          colorScheme='blue'
          size='md'
          variant='outline'
          onClick={() => {
            dispatch({
              type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
              payload: {
                action: WalletModalAction.Send,
                type: WalletModalType.Onchain,
                selectedFederation: state.gatewayInfo?.federations[0] ?? null,
                showSelector: true,
                isOpen: true,
              },
            });
          }}
          width='100%'
        >
          {t('wallet.send')}
        </Button>
      </Flex>
    </Flex>
  );
});

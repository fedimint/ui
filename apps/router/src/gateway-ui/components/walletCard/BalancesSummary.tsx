import React, { useMemo } from 'react';
import { Box, Flex, Text, Square } from '@chakra-ui/react';
import { formatValue, useTranslation } from '@fedimint/utils';
import { MSats } from '@fedimint/types';
import { PieChart } from 'react-minimal-pie-chart';
import { useGatewayContext } from '../../../hooks';
import { useBalanceCalculations } from '../../hooks/useBalanceCalculations';

export const BalancesSummary = React.memo(
  function BalancesSummary(): JSX.Element {
    const { t } = useTranslation();
    const { state } = useGatewayContext();
    const balanceAmounts = useBalanceCalculations(state.balances ?? undefined);

    const balanceData = useMemo(
      () => [
        {
          title: 'Ecash',
          value: balanceAmounts.ecash,
          formattedValue: formatValue(
            balanceAmounts.ecash as MSats,
            state.unit,
            true
          ),
          color: '#FF6384',
        },
        {
          title: 'Lightning',
          value: balanceAmounts.lightning,
          formattedValue: formatValue(
            balanceAmounts.lightning as MSats,
            state.unit,
            true
          ),
          color: '#36A2EB',
        },
        {
          title: 'Onchain',
          value: balanceAmounts.onchain,
          formattedValue: formatValue(
            balanceAmounts.onchain as MSats,
            state.unit,
            true
          ),
          color: '#FFCE56',
        },
      ],
      [balanceAmounts, state.unit]
    );

    return (
      <Box p={6} bg='white' borderRadius='lg' borderWidth='1px' mb={4}>
        <Text fontSize='xl' mb={4}>
          {t('wallet.balances-summary')}
        </Text>
        <Flex justify='space-between' align='center'>
          <Flex direction='column' flex={1}>
            {balanceData.map((item) => (
              <Flex key={item.title} mb={2} align='center'>
                <Square size='3' bg={item.color} mr={2} />
                <Text color='gray.600' flex='1'>
                  {item.title}:
                </Text>
                <Text fontWeight='medium'>{item.formattedValue}</Text>
              </Flex>
            ))}
            <Flex borderTopWidth={1} mt={3} pt={2}>
              <Text fontWeight='semibold' flex='1'>
                Total:
              </Text>
              <Text fontWeight='semibold'>
                {formatValue(balanceAmounts.total as MSats, state.unit, true)}
              </Text>
            </Flex>
          </Flex>
          <Box w='150px' h='150px' ml={8}>
            <PieChart
              data={balanceData}
              lineWidth={40}
              paddingAngle={2}
              startAngle={-90}
              animate
            />
          </Box>
        </Flex>
      </Box>
    );
  }
);

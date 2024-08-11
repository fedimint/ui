import React, { useMemo } from 'react';
import { Box, Button, Flex, Text, Square } from '@chakra-ui/react';
import { formatValue, useTranslation } from '@fedimint/utils';
import { GatewayCard } from '../GatewayCard';
import { FederationInfo, MSats } from '@fedimint/types';
import { PieChart } from 'react-minimal-pie-chart';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
  WalletModalAction,
  WalletModalState,
  WalletModalType,
} from '../walletModal/WalletModal';
import { Unit } from '../../App';

interface WalletCardProps {
  unit: Unit;
  federations: FederationInfo[];
  setWalletModalState: (state: WalletModalState) => void;
}

export const WalletCard = React.memo(function WalletCard({
  unit,
  federations,
  setWalletModalState,
}: WalletCardProps): JSX.Element {
  const { t } = useTranslation();

  const totalEcashBalance = useMemo(() => {
    return federations.reduce(
      (total, federation) => total + federation.balance_msat,
      0
    );
  }, [federations]);

  const balanceData = useMemo(
    () => [
      {
        title: t('wallet.ecash'),
        value: totalEcashBalance,
        formattedValue: formatValue(totalEcashBalance as MSats, unit, true),
        color: '#FF6384',
      },
      {
        title: t('wallet.lightning'),
        value: 500000000,
        formattedValue: formatValue(500000000 as MSats, unit, true),
        color: '#36A2EB',
      },
      {
        title: t('wallet.onchain'),
        value: 200000000,
        formattedValue: formatValue(200000000 as MSats, unit, true),
        color: '#FFCE56',
      },
    ],
    [totalEcashBalance, t, unit]
  );

  const totalBalance = useMemo(() => {
    return formatValue(
      balanceData.reduce((total, item) => total + item.value, 0) as MSats,
      unit,
      true
    );
  }, [balanceData, unit]);

  return (
    <GatewayCard title={t('wallet.title')}>
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
              setWalletModalState({
                action: WalletModalAction.Receive,
                type: WalletModalType.Onchain,
                selectedFederation: federations[0],
                isOpen: true,
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
              setWalletModalState({
                action: WalletModalAction.Send,
                type: WalletModalType.Onchain,
                selectedFederation: federations[0],
                isOpen: true,
              });
            }}
            width='100%'
          >
            {t('wallet.send')}
          </Button>
        </Flex>
      </Flex>
    </GatewayCard>
  );
});

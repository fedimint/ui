import React, { useMemo } from 'react';
import { Box, Button, Flex, Text, Square } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from '../GatewayCard';
import { FederationInfo } from '@fedimint/types';
import { PieChart } from 'react-minimal-pie-chart';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { WalletModalState } from '../../App';

interface WalletCardProps {
  federations: FederationInfo[];
  setWalletModalState: (state: WalletModalState) => void;
}

export const WalletCard = React.memo(function WalletCard({
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
        title: t('wallet-card.ecash'),
        value: totalEcashBalance,
        color: '#FF6384',
      },
      { title: t('wallet-card.lightning'), value: 500000000, color: '#36A2EB' },
      { title: t('wallet-card.onchain'), value: 200000000, color: '#FFCE56' },
    ],
    [totalEcashBalance, t]
  );

  const totalBalance = useMemo(() => {
    return balanceData.reduce((total, item) => total + item.value, 0);
  }, [balanceData]);

  return (
    <GatewayCard title={t('wallet-card.title')}>
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
                {item.value} sats
              </Text>
            </Flex>
          ))}
          <Box borderTop='1px' borderColor='gray.200' mt={4} pt={2}>
            <Flex justify='space-between'>
              <Text fontSize='md' fontWeight='bold'>
                {t('wallet-card.total')}:
              </Text>
              <Text fontSize='md' fontWeight='bold'>
                {totalBalance} sats
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
                action: 'deposit',
                type: 'onchain',
                selectedFederation: federations[0],
                isOpen: true,
              });
            }}
            width='100%'
          >
            {t('wallet-card.deposit')}
          </Button>
          <Button
            leftIcon={<FaArrowUp />}
            colorScheme='blue'
            size='md'
            variant='outline'
            onClick={() => {
              setWalletModalState({
                action: 'withdraw',
                type: 'onchain',
                selectedFederation: federations[0],
                isOpen: true,
              });
            }}
            width='100%'
          >
            {t('wallet-card.withdraw')}
          </Button>
        </Flex>
      </Flex>
    </GatewayCard>
  );
});

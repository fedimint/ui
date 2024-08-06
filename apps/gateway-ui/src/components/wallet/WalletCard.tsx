import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  Square,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from '../GatewayCard';
import { FederationInfo } from '@fedimint/types';
import { PieChart } from 'react-minimal-pie-chart';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface WalletCardProps {
  federations: FederationInfo[];
}

export const WalletCard = React.memo(function WalletCard({
  federations,
}: WalletCardProps): JSX.Element {
  const { t } = useTranslation();

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

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
        <Flex direction='column' flex={1}>
          {balanceData.map((item) => (
            <Flex
              key={item.title}
              justify='space-between'
              mb={2}
              align='center'
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
        <Box width='150px' height='150px' ml={8} position='relative'>
          <PieChart
            data={balanceData}
            lineWidth={40}
            paddingAngle={2}
            startAngle={-90}
            animate
          />
        </Box>

        {/* Deposit/Withdraw section */}
        <Flex direction='column' ml={8} width='150px'>
          <Button
            leftIcon={<FaArrowDown />}
            colorScheme='blue'
            size='md'
            mb={4}
            onClick={() => setIsDepositModalOpen(true)}
            width='100%'
          >
            {t('wallet-card.deposit')}
          </Button>
          <Button
            leftIcon={<FaArrowUp />}
            colorScheme='blue'
            size='md'
            variant='outline'
            onClick={() => setIsWithdrawModalOpen(true)}
            width='100%'
          >
            {t('wallet-card.withdraw')}
          </Button>
        </Flex>
      </Flex>

      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('deposit.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{/* Add deposit modal content here */}</ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('withdraw.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{/* Add withdraw modal content here */}</ModalBody>
        </ModalContent>
      </Modal>
    </GatewayCard>
  );
});

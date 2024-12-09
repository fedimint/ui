import React from 'react';
import { Flex } from '@chakra-ui/react';
import { BalancesSummary } from './BalancesSummary';
import { OnchainCard } from './OnchainCard';
import { EcashCard } from './EcashCard';
import { LightningCard } from './LightningCard';

export const WalletCard = React.memo(function WalletCard(): JSX.Element {
  return (
    <Flex direction='column' align='stretch' w='100%'>
      <BalancesSummary />
      <EcashCard />
      <LightningCard />
      <OnchainCard />
    </Flex>
  );
});

import React from 'react';
import { Flex, useTheme, Card, CardBody } from '@chakra-ui/react';
import { Network, Federation } from '@fedimint/types';
import { InfoCard, DepositCard, BalanceCard, WithdrawCard } from '.';

interface FederationCardProps {
  federation: Federation;
  network?: Network;
  lightning_pub_key: string;
}

export const FederationCard: React.FC<FederationCardProps> = ({
  federation,
  network,
  lightning_pub_key,
}) => {
  const { federation_id, balance_msat, config } = federation;

  return (
    <Card w='100%' maxWidth='100%'>
      <CardBody>
        <Flex gap='24px' flexDir={{ base: 'column', sm: 'column', md: 'row' }}>
          <BalanceCard
            federationName={config.meta.federation_name}
            balanceMsat={balance_msat}
            federationId={federation_id}
          />
          <InfoCard nodeId={lightning_pub_key} network={network} />
        </Flex>
        <br />
        <Flex gap='24px' flexDir={{ base: 'column', sm: 'column', md: 'row' }}>
          <DepositCard federationId={federation_id} network={network} />
          <WithdrawCard
            federationId={federation_id}
            balanceMsat={balance_msat}
          />
        </Flex>
      </CardBody>
    </Card>
  );
};

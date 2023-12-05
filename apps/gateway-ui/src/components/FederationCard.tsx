import React from 'react';
import { Flex, Stack, useTheme, Heading } from '@chakra-ui/react';
import { Network } from '@fedimint/types';
import { Federation } from '../types';
import { InfoCard, DepositCard, BalanceCard, WithdrawCard } from '.';
import { useTranslation } from '@fedimint/utils';

interface FederationCardProps {
  federation: Federation;
  network?: Network;
  pubkey: string;
}

export const FederationCard: React.FC<FederationCardProps> = ({
  federation,
  network,
  pubkey,
}) => {
  const { federation_id, balance_msat, config } = federation;

  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack spacing='24px'>
        <Heading
          fontWeight='500'
          fontSize='24px'
          size='xs'
          color={theme.colors.gray[900]}
          fontFamily={theme.fonts.heading}
        >
          {t('header.title')}
        </Heading>
        <Flex gap='24px' flexDir={{ base: 'column', sm: 'column', md: 'row' }}>
          <BalanceCard
            balance_msat={balance_msat}
            federationName={config.meta.federation_name || federation_id}
          />
          <InfoCard nodeId={pubkey} network={network} />
        </Flex>
        <Flex gap='24px' flexDir={{ base: 'column', sm: 'column', md: 'row' }}>
          <DepositCard federationId={federation_id} network={network} />
          <WithdrawCard
            federationId={federation_id}
            balanceMsat={balance_msat}
          />
        </Flex>
      </Stack>
    </>
  );
};

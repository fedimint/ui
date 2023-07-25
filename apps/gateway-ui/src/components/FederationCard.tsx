import React from 'react';
import { Flex, Stack, useTheme, Heading } from '@chakra-ui/react';
import { Federation } from '../types';
import { InfoTab, DepositTab, BalanceTab } from '.';
import { WithdrawTab } from './WithdrawTab';

interface FederationCardProps {
  federation: Federation;
}

export const FederationCard = (props: FederationCardProps): JSX.Element => {
  const { federation_id, balance_msat } = props.federation;
  const theme = useTheme();

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
          Human Action Coalition
        </Heading>
        <Flex gap='24px' flexDir={{ base: 'column', sm: 'column', md: 'row' }}>
          <BalanceTab balance_msat={balance_msat} />
          <InfoTab nodeId={federation_id} nodeLink={federation_id} />
        </Flex>
        <Flex gap='24px' flexDir={{ base: 'column', sm: 'column', md: 'row' }}>
          <DepositTab federationId={federation_id} />
          <WithdrawTab federationId={federation_id} />
        </Flex>
      </Stack>
    </>
  );
};

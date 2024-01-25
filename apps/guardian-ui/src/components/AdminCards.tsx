import React from 'react';
import { Flex } from '@chakra-ui/react';
import { FederationInfoCard } from './FederationInfoCard';
import { BalanceCard } from './BalanceCard';
import { BitcoinNodeCard } from './BitcoinNodeCard';
import {
  StatusResponse,
  ClientConfig,
  ModulesConfigResponse,
} from '@fedimint/types';

interface AdminCardProps {
  status: StatusResponse | undefined;
  config: ClientConfig | undefined;
  modulesConfigs: ModulesConfigResponse | undefined;
}

export const AdminCards: React.FC<AdminCardProps> = ({
  status,
  config,
  modulesConfigs,
}) => (
  <Flex
    gap={6}
    alignItems='flex-start'
    flexDir={{ base: 'column', sm: 'column', md: 'row' }}
  >
    <FederationInfoCard status={status} config={config} />
    <Flex w='100%' direction='column' gap={5}>
      <BalanceCard />
      <BitcoinNodeCard modulesConfigs={modulesConfigs} />
    </Flex>
  </Flex>
);

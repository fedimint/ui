import React, { useEffect, useState } from 'react';
import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import {
  ClientConfig,
  ModulesConfigResponse,
  StatusResponse,
} from '@fedimint/types';
import { useAdminContext } from '../hooks';
import { GatewaysCard } from '../components/GatewaysCard';
import { GuardiansCard } from '../components/GuardiansCard';
import { FederationInfoCard } from '../components/FederationInfoCard';
import { BitcoinNodeCard } from '../components/BitcoinNodeCard';
import { BalanceCard } from '../components/BalanceCard';
import { InviteCode } from '../components/InviteCode';

export const FederationAdmin: React.FC = () => {
  const { api } = useAdminContext();
  const [status, setStatus] = useState<StatusResponse>();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [config, setConfig] = useState<ClientConfig>();
  const [modulesConfigs, setModulesConfigs] = useState<ModulesConfigResponse>();

  useEffect(() => {
    api.modulesConfig().then(setModulesConfigs).catch(console.error);
    api.inviteCode().then(setInviteCode).catch(console.error);
    const fetchStatus = () => {
      console.log('fetching status');
      api.status().then(setStatus).catch(console.error);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (!inviteCode) return;
    api.config().then(setConfig).catch(console.error);
  }, [inviteCode, api]);

  // TODO: FIXME to use better loading state
  if (!config || !status) return <Text>{'Loading...'}</Text>;

  return (
    <Flex gap='32px' flexDirection='row'>
      <Flex gap={6} flexDirection='column' w='100%'>
        <Box maxWidth='440px'>
          <Heading size='xs' mt='12px'>
            {config.meta.federation_name}
          </Heading>
          <InviteCode inviteCode={inviteCode} />
        </Box>
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
        <GuardiansCard status={status} config={config} />
        <GatewaysCard config={config} />
      </Flex>
    </Flex>
  );
};

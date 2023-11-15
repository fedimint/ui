import React, { useEffect, useState } from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';
import { useAdminContext } from '../hooks';
import {
  ConfigResponse,
  ModulesConfigResponse,
  StatusResponse,
} from '../types';
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
  const [config, setConfig] = useState<ConfigResponse>();
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
    api.config(inviteCode).then(setConfig).catch(console.error);
  }, [inviteCode, api]);

  return (
    <Flex gap='32px' flexDirection='row'>
      <Flex gap={6} flexDirection='column' w='100%'>
        <Box maxWidth='440px'>
          <Heading size='xs' mt='12px'>
            {config?.client_config.meta.federation_name}
          </Heading>
          <InviteCode inviteCode={inviteCode} />
        </Box>
        <Flex
          gap={6}
          alignItems='flex-start'
          flexDir={{ base: 'column', sm: 'column', md: 'row' }}
        >
          <FederationInfoCard status={status} />
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

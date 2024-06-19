import React, { useEffect, useState } from 'react';
import { Flex, Box, Heading, Skeleton } from '@chakra-ui/react';
import {
  ClientConfig,
  ModulesConfigResponse,
  StatusResponse,
} from '@fedimint/types';
import { useAdminContext } from '../hooks';
import { GatewaysCard } from '../components/dashboard/gateways/GatewaysCard';
import { GuardiansCard } from '../components/dashboard/guardians/GuardiansCard';
import { FederationInfoCard } from '../components/dashboard/admin/FederationInfoCard';
import { BitcoinNodeCard } from '../components/dashboard/admin/BitcoinNodeCard';
import { BalanceCard } from '../components/dashboard/admin/BalanceCard';
import { InviteCode } from '../components/dashboard/admin/InviteCode';
import { FederationConfigCard } from '../components/dashboard/tabs/FederationConfigCard';
import { BftInfo } from '../components/BftInfo';
import { DangerZone } from '../components/dashboard/danger/DangerZone';

export const FederationAdmin: React.FC = () => {
  const { api } = useAdminContext();
  const [status, setStatus] = useState<StatusResponse>();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [config, setConfig] = useState<ClientConfig>();
  const [ourPeer, setOurPeer] = useState<{ id: number; name: string }>();
  const [modulesConfigs, setModulesConfigs] = useState<ModulesConfigResponse>();

  // Extracting our peer ID and name from intersection of config and status
  useEffect(() => {
    if (config && status?.federation) {
      const peerIds = Object.keys(status.federation.status_by_peer).map((id) =>
        parseInt(id, 10)
      );
      const configPeerIds = Object.keys(config.api_endpoints).map((id) =>
        parseInt(id, 10)
      );
      // Finding our peer ID as the one present in config but not in status
      const ourPeerId = configPeerIds.find((id) => !peerIds.includes(id));
      if (ourPeerId !== undefined) {
        setOurPeer({
          id: ourPeerId,
          name: config.api_endpoints[ourPeerId].name,
        });
      }
    }
  }, [config, status]);

  useEffect(() => {
    api.modulesConfig().then(setModulesConfigs).catch(console.error);
    api.inviteCode().then(setInviteCode).catch(console.error);
    api.config().then(setConfig).catch(console.error);
    const fetchStatus = () => {
      api.status().then(setStatus).catch(console.error);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Flex gap='32px' flexDirection='row'>
      <Flex gap={6} flexDirection='column' w='100%'>
        <Heading size='xs' mt='12px'>
          {config ? (
            config.meta.federation_name
          ) : (
            <Skeleton height='32px' width='180px' />
          )}
        </Heading>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent='space-between'
        >
          <Box maxWidth='480px'>
            <InviteCode inviteCode={inviteCode} />
          </Box>
          {config ? (
            <BftInfo numPeers={Object.keys(config.api_endpoints).length} />
          ) : null}
        </Flex>
        <Flex
          gap={6}
          alignItems='flex-start'
          flexDir={{ base: 'column', sm: 'column', md: 'row' }}
        >
          <Flex w='100%' direction='column' gap={5}>
            <FederationInfoCard status={status} config={config} />
            <BitcoinNodeCard modulesConfigs={modulesConfigs} />
          </Flex>
          <BalanceCard />
        </Flex>
        <GuardiansCard status={status} config={config} />
        <GatewaysCard config={config} />
        {ourPeer ? (
          <FederationConfigCard config={config} ourPeer={ourPeer} />
        ) : null}
        <DangerZone config={config} ourPeer={ourPeer} />
      </Flex>
    </Flex>
  );
};

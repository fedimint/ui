import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Skeleton } from '@chakra-ui/react';
import {
  ClientConfig,
  ModulesConfigResponse,
  StatusResponse,
} from '@fedimint/types';
import { useAdminContext } from '../hooks';
import { TabsCard } from '../components/TabsCard';
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
    api.config().then(setConfig).catch(console.error);
    const fetchStatus = () => {
      console.log('fetching status');
      api.status().then(setStatus).catch(console.error);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Flex gap='32px' flexDirection='row'>
      <Flex gap={6} flexDirection='column' w='100%'>
        <Box maxWidth='440px'>
          <Heading size='xs' mt='12px'>
            {config ? (
              config.meta.federation_name
            ) : (
              <Skeleton height='32px' width='180px' />
            )}
          </Heading>
          <InviteCode inviteCode={inviteCode} />
        </Box>
        <TabsCard
          status={status}
          config={config}
          modulesConfigs={modulesConfigs}
        />
      </Flex>
    </Flex>
  );
};

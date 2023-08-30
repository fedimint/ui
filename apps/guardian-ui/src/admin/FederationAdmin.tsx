import React, { useEffect, useState } from 'react';
import { Flex, Box, Icon, Text, useTheme } from '@chakra-ui/react';
import { CopyInput } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';
import { ConfigResponse, Gateway, StatusResponse } from '../types';
import { AdminMain } from '../components/AdminMain';
import { ConnectedNodes } from '../components/ConnectedNodes';
import { LightningModuleRpc } from '../GuardianApi';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { GuardiansCard } from './GuardiansCard';
import { FederationInfoCard } from './FederationInfoCard';

export const FederationAdmin: React.FC = () => {
  const theme = useTheme();
  const { api } = useAdminContext();
  const [status, setStatus] = useState<StatusResponse>();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [config, setConfig] = useState<ConfigResponse>();
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    // TODO: poll server status
    api.status().then(setStatus).catch(console.error);
    api.inviteCode().then(setInviteCode).catch(console.error);
  }, [api]);

  useEffect(() => {
    inviteCode && api.config(inviteCode).then(setConfig).catch(console.error);
  }, [inviteCode, api]);

  useEffect(() => {
    if (config) {
      for (const [key, val] of Object.entries(config.client_config.modules)) {
        if (val.kind === 'ln') {
          api
            .moduleApiCall<Gateway[]>(
              Number(key),
              LightningModuleRpc.listGateways
            )
            .then(setGateways)
            .catch(console.error);
          return;
        }
      }
    }
  }, [config, api]);

  return (
    <Flex gap='32px' flexDirection='row'>
      <Flex gap={4} flexDirection='column' w='100%'>
        <Flex>
          <Box>
            <Text
              fontSize='24px'
              fontWeight='600'
              lineHeight='32px'
              textTransform='capitalize'
            >
              {config?.client_config.meta.federation_name}
            </Text>
            <Text fontSize='14px' lineHeight='32px'>
              {t('federation-dashboard.placeholder-fed-description')}
            </Text>
            <Box mt='38px'>
              <Text
                mb='6px'
                fontSize='14px'
                fontWeight='500'
                color={theme.colors.gray[700]}
              >
                {t('federation-dashboard.invite-members')}
              </Text>
              <CopyInput
                value={inviteCode}
                buttonLeftIcon={<Icon as={CopyIcon} />}
              />
              <Text
                mt='6px'
                mb='25px'
                fontSize='14px'
                color={theme.colors.gray[500]}
              >
                {t('federation-dashboard.invite-members-prompt')}
              </Text>
            </Box>
          </Box>
        </Flex>
        <AdminMain />
        <Flex gap={4}>
          <FederationInfoCard status={status} />
        </Flex>
        <GuardiansCard status={status} config={config} />
        <ConnectedNodes gateways={gateways} />
      </Flex>
    </Flex>
  );
};

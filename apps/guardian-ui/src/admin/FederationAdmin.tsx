import React, { useEffect, useState, useMemo } from 'react';
import {
  Flex,
  Card,
  CardBody,
  CardHeader,
  Table,
  Tbody,
  Tr,
  Td,
  Box,
  Icon,
  Text,
  useTheme,
} from '@chakra-ui/react';
import { CopyInput } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';
import { ConfigResponse, Gateway, StatusResponse, Versions } from '../types';
import { AdminMain } from '../components/AdminMain';
import { ConnectedNodes } from '../components/ConnectedNodes';
import { LightningModuleRpc } from '../GuardianApi';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { GuardiansCard } from './GuardiansCard';

export const FederationAdmin: React.FC = () => {
  const theme = useTheme();
  const { api } = useAdminContext();
  const [versions, setVersions] = useState<Versions>();
  const [epochCount, setEpochCount] = useState<number>();
  const [status, setStatus] = useState<StatusResponse>();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [config, setConfig] = useState<ConfigResponse>();
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    api.version().then(setVersions).catch(console.error);
    api.fetchEpochCount().then(setEpochCount).catch(console.error);
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

  const [guardiansStatusText, statusType] = useMemo(() => {
    const online = status?.federation ? status.federation.peers_online + 1 : 1;
    const offline = status?.federation ? status.federation.peers_offline : 0;
    const totalPeers = online + offline;
    const onlinePercentage = online / totalPeers;
    const statusType: 'success' | 'warning' | 'error' =
      onlinePercentage === 1
        ? 'success'
        : onlinePercentage >= 2 / 3
        ? 'warning'
        : 'error';
    const guardiansStatusText = `${online} / ${totalPeers}`;
    return [guardiansStatusText, statusType];
  }, [status]);

  const apiVersion = versions?.core.api.length
    ? `${versions.core.api[0].major}.${versions.core.api[0].minor}`
    : '';
  const consensusVersion =
    versions?.core.core_consensus !== undefined
      ? `${versions.core.core_consensus}`
      : '';

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
          <Card flex='1'>
            <CardHeader>
              <Text size='lg' fontWeight='600'>
                {t('federation-dashboard.fed-info.label')}
              </Text>
            </CardHeader>
            <CardBody>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>
                      {t('federation-dashboard.fed-info.your-status-label')}
                    </Td>
                    <Td>{status?.server}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {t('federation-dashboard.fed-info.epoch-count-label')}
                    </Td>
                    <Td>{epochCount}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {t('federation-dashboard.fed-info.api-version-label')}
                    </Td>
                    <Td>{apiVersion}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {t(
                        'federation-dashboard.fed-info.consensus-version-label'
                      )}
                    </Td>
                    <Td>{consensusVersion}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </Flex>
        <GuardiansCard status={status} config={config} />
        <ConnectedNodes gateways={gateways} />
      </Flex>
    </Flex>
  );
};

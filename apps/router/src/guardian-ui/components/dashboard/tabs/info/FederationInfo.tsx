import React, { useEffect, useMemo, useState } from 'react';
import { SimpleGrid, Box, Skeleton, Flex } from '@chakra-ui/react';
import {
  ClientConfig,
  StatusResponse,
  Versions,
  ModuleConfigs,
  ModuleKind,
  BitcoinRpcConnectionStatus,
} from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { KeyValues, NetworkIndicator } from '@fedimint/ui';
import { useGuardianAdminApi } from '../../../../../context/hooks';
import { BftInfo } from '../../../BftInfo';

interface Props {
  status: StatusResponse | undefined;
  config: ClientConfig | undefined;
  latestSession: number | undefined;
  modulesConfigs: ModuleConfigs | undefined;
}

export const FederationInfo: React.FC<Props> = ({
  status,
  config,
  latestSession,
  modulesConfigs,
}) => {
  const { t } = useTranslation();
  const api = useGuardianAdminApi();
  const [versions, setVersions] = useState<Versions>();
  const [blockCount, setBlockCount] = useState<number>();
  const [bitcoinStatus, setBitcoinStatus] =
    useState<BitcoinRpcConnectionStatus>();

  const serverStatus = status?.server || '';
  const apiVersion = versions?.core.api.length
    ? `${versions.core.api[0].major}.${versions.core.api[0].minor}`
    : '';
  const consensusVersion =
    versions?.core.core_consensus !== undefined
      ? `${versions.core.core_consensus.major}.${versions.core.core_consensus.minor}`
      : '';

  useEffect(() => {
    api.version().then(setVersions).catch(console.error);
  }, [api]);

  useEffect(() => {
    const fetchBitcoinStatus = async () => {
      try {
        const status = await api.checkBitcoinStatus();
        setBitcoinStatus(status);
      } catch (error) {
        console.error('Failed to fetch Bitcoin status:', error);
      }
    };

    fetchBitcoinStatus();
  }, [api]);

  useEffect(() => {
    if (!config) return;
    const fetchBlockCount = () => {
      api.fetchBlockCount(config).then(setBlockCount).catch(console.error);
    };
    fetchBlockCount();
    const interval = setInterval(fetchBlockCount, 5000);
    return () => clearInterval(interval);
  }, [api, config]);

  const walletConfig = modulesConfigs
    ? Object.values(modulesConfigs).find(
        (config): config is ModuleConfigs[ModuleKind.Wallet] =>
          config.kind === ModuleKind.Wallet
      )
    : undefined;

  const federationInfoKeyValues = useMemo(
    () => [
      {
        key: 'status',
        label: t('federation-dashboard.info.your-status-label'),
        value: serverStatus,
      },
      {
        key: 'sessionHeight',
        label: t('federation-dashboard.info.session-info.session-height'),
        value: latestSession ?? 0,
      },
      {
        key: 'version',
        label: t('federation-dashboard.info.version-label'),
        value: `${consensusVersion} / ${apiVersion}`,
      },
    ],
    [t, serverStatus, latestSession, consensusVersion, apiVersion]
  );

  const bitcoinInfoKeyValues = useMemo(
    () => [
      {
        key: 'network',
        label: t('federation-dashboard.bitcoin-node.network-label'),
        value: walletConfig ? (
          <NetworkIndicator
            network={walletConfig.network}
            bitcoinRpcUrl={walletConfig.default_bitcoin_rpc?.url}
          />
        ) : (
          <Skeleton height='24px' width='100px' />
        ),
      },
      {
        key: 'blockCount',
        label: t('federation-dashboard.info.consensus-block-height-label'),
        value: blockCount ?? <Skeleton height='24px' width='60px' />,
      },
      {
        key: 'bitcoinStatus',
        label: t('federation-dashboard.info.bitcoin-status-label'),
        value: bitcoinStatus,
      },
    ],
    [t, walletConfig, blockCount, bitcoinStatus]
  );

  return (
    <Flex direction='column' gap={6}>
      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <KeyValues keyValues={federationInfoKeyValues} />
        </Box>
        <Box>
          <KeyValues keyValues={bitcoinInfoKeyValues} />
        </Box>
      </SimpleGrid>
      {config && (
        <Box width='100%'>
          <BftInfo numPeers={Object.keys(config.global.api_endpoints).length} />
        </Box>
      )}
    </Flex>
  );
};

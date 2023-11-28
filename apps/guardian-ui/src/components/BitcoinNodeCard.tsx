import React, { useMemo } from 'react';
import { Card, CardBody, CardHeader, Skeleton, Text } from '@chakra-ui/react';
import {
  ModuleConfig,
  ModuleKind,
  ModulesConfigResponse,
} from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { KeyValues } from '@fedimint/ui';

interface Props {
  modulesConfigs: ModulesConfigResponse | undefined;
}

export const BitcoinNodeCard: React.FC<Props> = ({ modulesConfigs }) => {
  const { t } = useTranslation();

  const walletConfig = modulesConfigs
    ? Object.values(modulesConfigs).find(
        (config): config is ModuleConfig<ModuleKind.Wallet> =>
          config.kind === ModuleKind.Wallet
      )
    : undefined;

  // TODO: Populate values from config.modules.config
  // It's currently mysteriously hex encoded
  const keyValues = useMemo(
    () => [
      {
        key: 'url',
        label: t('federation-dashboard.bitcoin-node.url-label'),
        value: walletConfig ? (
          walletConfig.client_default_bitcoin_rpc?.url
        ) : (
          <Skeleton height='24px' width='160px' />
        ),
      },
      {
        key: 'network',
        label: t('federation-dashboard.bitcoin-node.network-label'),
        value: walletConfig ? (
          walletConfig.network
        ) : (
          <Skeleton height='24px' width='100px' />
        ),
      },
    ],
    [walletConfig, t]
  );

  return (
    <Card w='100%'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.bitcoin-node.label')}
        </Text>
      </CardHeader>
      <CardBody>
        <KeyValues direction='row' keyValues={keyValues} />
      </CardBody>
    </Card>
  );
};

import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { StatusResponse, Versions } from '../types';
import { useAdminContext } from '../hooks';
import { KeyValues } from '@fedimint/ui';

interface Props {
  status: StatusResponse | undefined;
}

export const FederationInfoCard: React.FC<Props> = ({ status }) => {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const [versions, setVersions] = useState<Versions>();
  const [epochCount, setEpochCount] = useState<number>();

  const serverStatus = status?.server || '';
  const apiVersion = versions?.core.api.length
    ? `${versions.core.api[0].major}.${versions.core.api[0].minor}`
    : '';
  const consensusVersion =
    versions?.core.core_consensus !== undefined
      ? `${versions.core.core_consensus}`
      : '';

  useEffect(() => {
    api.version().then(setVersions).catch(console.error);
    api.fetchEpochCount().then(setEpochCount).catch(console.error);
  }, [api]);

  const keyValues = useMemo(
    () => [
      {
        key: 'status',
        label: t('federation-dashboard.fed-info.your-status-label'),
        value: serverStatus,
      },
      {
        key: 'epochCount',
        label: t('federation-dashboard.fed-info.epoch-count-label'),
        value: epochCount,
      },
      {
        key: 'apiVersion',
        label: t('federation-dashboard.fed-info.api-version-label'),
        value: apiVersion,
      },
      {
        key: 'consensusVersion',
        label: t('federation-dashboard.fed-info.consensus-version-label'),
        value: consensusVersion,
      },
    ],
    [t, serverStatus, epochCount, apiVersion, consensusVersion]
  );

  return (
    <Card w='100%'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.fed-info.label')}
        </Text>
      </CardHeader>
      <CardBody>
        <KeyValues keyValues={keyValues} />
      </CardBody>
    </Card>
  );
};

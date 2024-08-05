import React, { useMemo } from 'react';
import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import {
  ClientConfig,
  PeerConnectionStatus,
  SignedApiAnnouncement,
  StatusResponse,
} from '@fedimint/types';
import { StatusIndicator, Table, TableColumn, TableRow } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';

type TableKey = 'idName' | 'status' | 'health' | 'lastContribution' | 'apiUrl';

interface Props {
  status: StatusResponse | undefined;
  config: ClientConfig | undefined;
  signedApiAnnouncements: Record<string, SignedApiAnnouncement>;
}

export const GuardiansCard: React.FC<Props> = ({
  status,
  config,
  signedApiAnnouncements,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<TableKey>[] = useMemo(
    () => [
      {
        key: 'idName',
        heading: t('federation-dashboard.guardians.id-name-label'),
      },
      {
        key: 'status',
        heading: t('federation-dashboard.guardians.status-label'),
      },
      {
        key: 'health',
        heading: t('federation-dashboard.guardians.health-label'),
      },
      {
        key: 'lastContribution',
        heading: t('federation-dashboard.guardians.last-contribution-label'),
      },
      {
        key: 'apiUrl',
        heading: t('federation-dashboard.guardians.api-url-label'),
      },
    ],
    [t]
  );

  const rows: TableRow<TableKey>[] = useMemo(() => {
    if (!status?.federation || !config) return [];
    const peerDataArray = [];
    for (const [id, federationStatus] of Object.entries(
      status.federation.status_by_peer
    )) {
      const numericId = parseInt(id, 10);
      const endpoint = config.global.api_endpoints[numericId];
      const apiAnnouncement = signedApiAnnouncements[id];
      if (endpoint) {
        peerDataArray.push({
          key: id,
          idName: `${numericId}: ${endpoint.name}`,
          status: (
            <StatusIndicator
              status={
                federationStatus.connection_status ===
                PeerConnectionStatus.Disconnected
                  ? 'error'
                  : 'success'
              }
            >
              {federationStatus.connection_status}
            </StatusIndicator>
          ),
          health: (
            <StatusIndicator
              status={federationStatus.flagged ? 'error' : 'success'}
            >
              {t(
                federationStatus.flagged
                  ? 'federation-dashboard.guardians.health-issue'
                  : 'federation-dashboard.guardians.health-good'
              )}
            </StatusIndicator>
          ),
          lastContribution: federationStatus.last_contribution,
          apiUrl: apiAnnouncement?.api_announcement.api_url,
        });
      }
    }
    return peerDataArray;
  }, [status, config, signedApiAnnouncements, t]);

  if (config && !rows.length) {
    return null;
  }

  return (
    <Card flex='1'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.guardians.label')}
        </Text>
      </CardHeader>
      <CardBody>
        <Table columns={columns} rows={rows} />
      </CardBody>
    </Card>
  );
};

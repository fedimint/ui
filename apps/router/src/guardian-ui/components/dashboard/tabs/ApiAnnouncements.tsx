import React, { useMemo } from 'react';
import { ClientConfig, SignedApiAnnouncement } from '@fedimint/types';
import { Table, TableColumn, TableRow } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';

type TableKey = 'guardian' | 'revision' | 'apiUrl';

interface Props {
  signedApiAnnouncements: Record<string, SignedApiAnnouncement>;
  config: ClientConfig;
}

export const ApiAnnouncements: React.FC<Props> = ({
  signedApiAnnouncements,
  config,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<TableKey>[] = useMemo(
    () => [
      {
        key: 'guardian',
        heading: t('federation-dashboard.api-announcements.guardian'),
        width: '20%',
      },
      {
        key: 'revision',
        heading: t('federation-dashboard.api-announcements.revision'),
        width: '10%',
      },
      {
        key: 'apiUrl',
        heading: t('federation-dashboard.api-announcements.api-url'),
      },
    ],
    [t]
  );

  const rows: TableRow<TableKey>[] = useMemo(() => {
    return Object.entries(signedApiAnnouncements).map(([id, announcement]) => {
      const numericId = parseInt(id, 10);
      const endpoint = config.global.api_endpoints[numericId];
      return {
        key: id,
        guardian: endpoint ? endpoint.name : id,
        revision: announcement.api_announcement.nonce.toString(),
        apiUrl: announcement.api_announcement.api_url,
      };
    });
  }, [signedApiAnnouncements, config]);

  return <Table columns={columns} rows={rows} />;
};

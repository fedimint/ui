import React, { useEffect, useMemo } from 'react';
import { Flex, Text, useTheme } from '@chakra-ui/react';
import { useTranslation, hexToMeta, metaToFields } from '@fedimint/utils';
import { ConsensusMeta, MetaFields } from '@fedimint/types';
import { useAdminContext } from '../../hooks';
import { ModuleRpc } from '../../types';
import { Table, TableColumn, TableRow } from '@fedimint/ui';

interface ViewConsensusMetaProps {
  metaKey: number;
  metaModuleId: string;
  consensusMeta?: ConsensusMetaFields;
  pollTimeout: number;
  updateConsensusMeta: (meta: ConsensusMetaFields) => void;
}

export interface ConsensusMetaFields {
  revision: number;
  value: MetaFields;
}

type TableKey = 'metaKey' | 'value';

export const ViewConsensusMeta = React.memo(function ConsensusMetaFields({
  consensusMeta,
  metaModuleId,
  metaKey,
  pollTimeout,
  updateConsensusMeta,
}: ViewConsensusMetaProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const theme = useTheme();

  useEffect(() => {
    const pollConsensusMeta = setInterval(async () => {
      try {
        const meta = await api.moduleApiCall<ConsensusMeta>(
          Number(metaModuleId),
          ModuleRpc.getConsensus,
          metaKey
        );
        if (!meta) return;
        const consensusMeta: ConsensusMetaFields = {
          revision: meta.revision,
          value: metaToFields(hexToMeta(meta.value)),
        };
        updateConsensusMeta(consensusMeta);
      } catch (err) {
        console.warn('Failed to poll for consensus meta', err);
      }
    }, pollTimeout);
    return () => {
      clearInterval(pollConsensusMeta);
    };
  }, [api, metaModuleId, metaKey, pollTimeout, updateConsensusMeta]);

  const columns: TableColumn<TableKey>[] = useMemo(
    () => [
      {
        key: 'metaKey',
        heading: t('set-config.meta-fields-key'),
      },
      {
        key: 'value',
        heading: t('set-config.meta-fields-value'),
      },
    ],
    [t]
  );

  const rows: TableRow<TableKey>[] = useMemo(() => {
    if (!consensusMeta) return [] as TableRow<TableKey>[];
    return consensusMeta?.value.map(([key, value], idx) => {
      return {
        key: idx,
        metaKey: <Text size={'md'}>{key}</Text>,
        value: <Text size={'md'}>{value}</Text>,
      };
    });
  }, [consensusMeta]);

  return (
    <Flex
      flexDir='column'
      width='100%'
      pl={4}
      borderLeft={`1px solid ${theme.colors.border.input}`}
    >
      <Flex flexDir='column' gap={2} mb={4}>
        <Text fontSize='lg'>
          {t('federation-dashboard.config.manage-meta.consensus-meta-label')}
        </Text>
        <Text fontSize='sm' fontStyle='italic'>
          revision: {consensusMeta?.revision}
        </Text>
      </Flex>
      {consensusMeta ? (
        <Table columns={columns} rows={rows} />
      ) : (
        <Text fontSize='sm'>
          {t(
            'federation-dashboard.config.manage-meta.no-consensus-meta-message'
          )}
        </Text>
      )}
    </Flex>
  );
});

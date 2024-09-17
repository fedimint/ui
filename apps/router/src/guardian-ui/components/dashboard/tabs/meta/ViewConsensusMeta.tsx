import React, { useMemo } from 'react';
import { Flex, Text, useTheme } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ParsedConsensusMeta } from '@fedimint/types';
import { Table, TableColumn, TableRow } from '@fedimint/ui';

interface ViewConsensusMetaProps {
  consensusMeta: ParsedConsensusMeta;
}

type TableKey = 'metaKey' | 'value';

export const ViewConsensusMeta = React.memo(function ConsensusMetaFields({
  consensusMeta,
}: ViewConsensusMetaProps): JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

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
    return consensusMeta.value.map(([key, value]) => {
      return {
        key: `${key}-${value}`,
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
          {t('federation-dashboard.config.manage-meta.revision')}:{' '}
          {consensusMeta?.revision}
        </Text>
      </Flex>
      <Table columns={columns} rows={rows} />
    </Flex>
  );
});

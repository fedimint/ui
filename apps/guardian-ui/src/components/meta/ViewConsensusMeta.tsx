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
      {consensusMeta ? (
        <>
          <Flex flexDir='column' gap={2} mb={4}>
            <Text fontSize='lg'>
              {t(
                'federation-dashboard.config.manage-meta.consensus-meta-label'
              )}
            </Text>
            <Text fontSize='sm' fontStyle='italic'>
              {t('federation-dashboard.config.manage-meta.revision')}:{' '}
              {consensusMeta?.revision}
            </Text>
          </Flex>
          <Table columns={columns} rows={rows} />
        </>
      ) : (
        <Flex flexDir='column' gap={2}>
          <Text fontSize='md' fontWeight='bold'>
            Setting up a Meta for your Federation
          </Text>
          <Text fontSize='sm'>
            Fedimint can supply additional information to clients in the form of
            meta fields: key-values pairs with arbitrary information you might
            want to share with clients. While these meta fields are not
            interpreted by Fedimint, they are consensus relevant, i.e. they
            cannot differ between federation members. This way clients can rely
            on their correctness.
          </Text>
          <Text fontSize='sm'>
            As a fedimint guardian, you can propose updates to the meta which
            will be accepted by the other guardians. Once the update is accepted
            by a threshold of guardians, it will be adopted as the new consensus
            meta for the federation.
          </Text>
          <Text fontSize='sm' mt={2}>
            The following meta fields have been defined as part of the core
            Fedimint protocol and are useful to include for your
            federation&apos;s meta:
          </Text>
          <Flex flexDir='column' pl={4} mt={2}>
            <Text fontSize='sm'>
              - <b>federation_expiry_timestamp</b>: A timestamp after which the
              federation will shut down. This is a unix timestamp in seconds.
            </Text>
            <Text fontSize='sm'>
              - <b>federation_name</b>: The human-readable name of the
              federation
            </Text>
            <Text fontSize='sm'>
              - <b>federation_icon_url</b>: A URL to a logo icon for the
              federation
            </Text>
            <Text fontSize='sm'>
              - <b>welcome_message</b>: A welcome message for new users joining
              the federation
            </Text>
            <Text fontSize='sm'>
              - <b>vetted_gateways</b>: A list of gateway identifiers vetted by
              the federation
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
});

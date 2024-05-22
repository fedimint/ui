import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { MetaFields } from '@fedimint/types';
import { ViewConsensusMeta, ConsensusMetaFields } from './ViewConsensusMeta';
import { ProposedMetas } from './ProposedMetas';

export const DEFAULT_META_KEY = 0;
const POLL_TIMEOUT_MS = 2000;

interface MetaManagerProps {
  metaModuleId?: string;
  consensusMeta?: ConsensusMetaFields;
  setConsensusMeta: (meta: ConsensusMetaFields) => void;
  editedMetaFields: MetaFields;
  setEditedMetaFields: (fields: MetaFields) => void;
  ourPeer: { id: number; name: string };
}

export const MetaManager = React.memo(function MetaManager({
  metaModuleId,
  ourPeer,
  consensusMeta,
  setConsensusMeta,
  setEditedMetaFields,
}: MetaManagerProps): JSX.Element {
  const { t } = useTranslation();

  return metaModuleId ? (
    <Flex direction='row' gap={6} width='100%'>
      <ViewConsensusMeta
        metaKey={DEFAULT_META_KEY}
        metaModuleId={metaModuleId}
        consensusMeta={consensusMeta}
        updateConsensusMeta={(meta: ConsensusMetaFields) =>
          setConsensusMeta(meta)
        }
        pollTimeout={POLL_TIMEOUT_MS}
      />
      <ProposedMetas
        ourPeer={ourPeer}
        metaModuleId={metaModuleId}
        updateEditedMetaFields={(fields: MetaFields) => {
          setEditedMetaFields([...fields]);
        }}
        pollTimeout={POLL_TIMEOUT_MS}
      />
    </Flex>
  ) : (
    <Text>{t('federation-dashboard.config.missing-meta-module')}</Text>
  );
});

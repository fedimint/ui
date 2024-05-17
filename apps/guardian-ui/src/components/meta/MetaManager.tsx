import React, { useCallback, useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useTranslation, metaToHex, fieldsToMeta } from '@fedimint/utils';
import { MetaConfig, MetaFields } from '@fedimint/types';
import { ModuleRpc } from '../../types';
import { useAdminContext } from '../../hooks';
import { EditMetaField } from './EditMetaField';
import { ViewConsensusMeta, ConsensusMetaFields } from './ViewConsensusMeta';
import { UpdateMetaFields } from './UpdateMetaFields';

export const DEFAULT_META_KEY = 0;
const POLL_TIMEOUT_MS = 2000;

interface MetaManagerProps {
  metaModuleId?: string;
  metaConfig: MetaConfig;
  ourPeer: { id: number; name: string };
}

export const MetaManager = React.memo(function MetaManager({
  metaModuleId,
  ourPeer,
}: MetaManagerProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();

  const [consensusMeta, setConsensusMeta] = useState<ConsensusMetaFields>();
  const [editedMetaFields, setEditedMetaFields] = useState<MetaFields>([]);

  const editConsensusMeta = useCallback(() => {
    if (consensusMeta) {
      setEditedMetaFields(consensusMeta.value);
    }
  }, [consensusMeta]);

  const proposeMetaEdits = useCallback(() => {
    if (metaModuleId === undefined) {
      return;
    }

    if (editedMetaFields === consensusMeta?.value) {
      console.log('Meta fields proposed are already in consensus');
      setEditedMetaFields([]);
      return;
    }

    api
      .moduleApiCall<{ metaValue: string }[]>(
        Number(metaModuleId),
        ModuleRpc.submitMeta,
        {
          key: DEFAULT_META_KEY,
          value: metaToHex(fieldsToMeta(editedMetaFields)),
        }
      )
      .then(() => setEditedMetaFields([]))
      .catch(console.error);
  }, [api, metaModuleId, editedMetaFields, consensusMeta]);

  return metaModuleId ? (
    <Flex direction='column' gap={6}>
      <ViewConsensusMeta
        metaKey={DEFAULT_META_KEY}
        metaModuleId={metaModuleId}
        consensusMeta={consensusMeta}
        updateConsensusMeta={(meta: ConsensusMetaFields) =>
          setConsensusMeta(meta)
        }
        pollTimeout={POLL_TIMEOUT_MS}
      />
      <UpdateMetaFields
        ourPeer={ourPeer}
        metaModuleId={metaModuleId}
        updateEditedMetaFields={(fields: MetaFields) => {
          setEditedMetaFields([...editedMetaFields, ...fields]);
        }}
        pollTimeout={POLL_TIMEOUT_MS}
      />
      <Box>
        <Text>
          {t('federation-dashboard.config.manage-meta.edit-meta-label')}
        </Text>
        <EditMetaField
          metaFields={editedMetaFields}
          onChangeMetaFields={setEditedMetaFields}
          protectDerivedMeta={false}
        />
      </Box>
      <Flex gap={2}>
        <Button
          onClick={proposeMetaEdits}
          justifySelf='center'
          alignSelf='center'
          width={['100%', 'auto']}
        >
          {t(
            'federation-dashboard.config.manage-meta.submit-meta-edits-button'
          )}
        </Button>
        <Button
          onClick={editConsensusMeta}
          justifySelf='center'
          alignSelf='center'
          width={['100%', 'auto']}
          variant='outline'
        >
          {t(
            'federation-dashboard.config.manage-meta.edit-consensus-meta-button'
          )}
        </Button>
      </Flex>
    </Flex>
  ) : (
    <Text>{t('federation-dashboard.config.missing-meta-module')}</Text>
  );
});

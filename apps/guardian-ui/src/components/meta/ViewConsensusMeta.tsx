import React, { useEffect } from 'react';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { useTranslation, hexToMeta, metaToFields } from '@fedimint/utils';
import { ConsensusMeta, MetaFields } from '@fedimint/types';
import { useAdminContext } from '../../hooks';
import { ModuleRpc } from '../../types';

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

export const ViewConsensusMeta = React.memo(function ConsensusMetaFields({
  consensusMeta,
  metaModuleId,
  metaKey,
  pollTimeout,
  updateConsensusMeta,
}: ViewConsensusMetaProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();

  useEffect(() => {
    let pollConsensusMetaTimeout: ReturnType<typeof setTimeout>;
    const pollConsensusMeta = async () => {
      api
        .moduleApiCall<ConsensusMeta>(
          Number(metaModuleId),
          ModuleRpc.getConsensus,
          metaKey
        )
        .then((meta) => {
          if (meta) {
            const consensusMeta: ConsensusMetaFields = {
              revision: meta.revision,
              value: metaToFields(hexToMeta(meta.value)),
            };
            updateConsensusMeta(consensusMeta);
          }
        })
        .catch((err) => {
          console.warn('Failed to poll for consensus meta', err);
        })
        .finally(() => {
          pollConsensusMetaTimeout = setTimeout(pollConsensusMeta, pollTimeout);
        });
    };

    pollConsensusMeta();

    return () => {
      clearTimeout(pollConsensusMetaTimeout);
    };
  }, [api, metaModuleId, metaKey, pollTimeout, updateConsensusMeta]);

  return (
    <Box>
      <Text fontSize='lg'>
        {t('federation-dashboard.config.manage-meta.consensus-meta-label')}
      </Text>
      {consensusMeta ? (
        <Flex direction='column' gap={2} pt={2} pb={2}>
          <Text px={2}>{'revision ' + consensusMeta.revision}</Text>
          {consensusMeta.value.map(([key, value], idx) => (
            <Flex gap={2} key={idx} align='center'>
              <Input
                placeholder={t('set-config.meta-fields-key')}
                value={key}
              />
              <Input value={value} />
            </Flex>
          ))}
        </Flex>
      ) : (
        <Text fontSize='sm'>
          {t(
            'federation-dashboard.config.manage-meta.no-consensus-meta-message'
          )}
        </Text>
      )}
    </Box>
  );
});

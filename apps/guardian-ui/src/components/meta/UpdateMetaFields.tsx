import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from '../../assets/svgs/check.svg';
import { ReactComponent as CloseIcon } from '../../assets/svgs/x.svg';
import {
  useTranslation,
  hexToMeta,
  metaToHex,
  fieldsToMeta,
} from '@fedimint/utils';
import { MetaFields, MetaSubmissions } from '@fedimint/types';

import { useAdminContext } from '../../hooks';
import { ModuleRpc } from '../../types';
import { Table, TableColumn, TableRow } from '@fedimint/ui';
import { DEFAULT_META_KEY } from './MetaManager';

type MetaSubmissionMap = { [key: string]: { [value: string]: string[] } };
type MetaSubmissionFields = [string, string, string[]][];

interface UpdateMetaFieldsProps {
  ourPeer: { id: number; name: string };
  metaModuleId: string;
  updateEditedMetaFields: (fields: MetaFields) => void;
  pollTimeout: number;
}

type TableKey = 'metaKey' | 'value' | 'guardians' | 'actions';

export const UpdateMetaFields = React.memo(function UpdateMetaFields({
  ourPeer,
  metaModuleId,
  pollTimeout,
}: UpdateMetaFieldsProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();

  const [metaSubmissions, setMetaSubmissions] = useState<MetaSubmissionFields>(
    []
  );

  useEffect(() => {
    const pollSubmissionInterval = setInterval(async () => {
      try {
        const submissions = await api.moduleApiCall<MetaSubmissions>(
          Number(metaModuleId),
          ModuleRpc.getSubmissions,
          0
        );

        const metaMap: MetaSubmissionMap = {};

        Object.entries(submissions).map(([peer, submission]) => {
          const meta = hexToMeta(submission);
          Object.entries(meta).map(([key, value]) => {
            if (value) {
              if (metaMap[key]) {
                if (metaMap[key][value]) {
                  metaMap[key][value].push(peer);
                } else {
                  metaMap[key][value] = [peer];
                }
              } else {
                metaMap[key] = { [value]: [peer] };
              }
            }
          });
        });

        const transformed = Object.entries(metaMap).reduce((acc, [k, v]) => {
          Object.entries(v).map(([a, b]) => {
            acc.push([k, a, b]);
          });
          return acc;
        }, [] as MetaSubmissionFields);

        setMetaSubmissions(transformed);
      } catch (err) {
        console.warn('Failed to poll for meta submissions', err);
      }
    }, pollTimeout);
    return () => {
      clearInterval(pollSubmissionInterval);
    };
  }, [api, metaModuleId, pollTimeout]);

  const handleApprove = useCallback(
    async (key: string, value: string) => {
      try {
        // Submit the meta fields for the guardian
        await api.moduleApiCall<{ metaValue: string }[]>(
          Number(metaModuleId),
          ModuleRpc.submitMeta,
          {
            key: DEFAULT_META_KEY,
            value: metaToHex(fieldsToMeta([[key, value]])),
          }
        );

        console.log(`Approved and submitted meta edit: ${key} - ${value}`);

        // Update the state to reflect the approval
        setMetaSubmissions((prev) =>
          prev.map((submission) =>
            submission[0] === key && submission[1] === value
              ? [key, value, [...submission[2], ourPeer.id.toString()]]
              : submission
          )
        );
      } catch (err) {
        console.error('Failed to submit meta edit', err);
      }
    },
    [api, metaModuleId, ourPeer.id]
  );

  const handleReject = useCallback((key: string, value: string) => {
    // Handle rejection logic if needed
    console.log(`Rejected meta edit: ${key} - ${value}`);
  }, []);

  const columns: TableColumn<TableKey>[] = [
    {
      key: 'metaKey',
      heading: t('set-config.meta-fields-key'),
    },
    {
      key: 'value',
      heading: t('set-config.meta-fields-value'),
    },
    {
      key: 'guardians',
      heading: t('federation-dashboard.config.manage-meta.peer-approvals'),
    },
    {
      key: 'actions',
      heading: t('federation-dashboard.config.manage-meta.actions'),
    },
  ];

  const rows: TableRow<TableKey>[] = metaSubmissions.map(
    ([key, value, peers]) => {
      const hasVoted = peers.includes(ourPeer.id.toString());
      return {
        key: `${key}-${value}`,
        metaKey: <Text>{key}</Text>,
        value: <Text>{value}</Text>,
        guardians: <Text>{peers.join(', ')}</Text>,
        actions: (
          <Flex>
            {hasVoted ? (
              <Flex alignItems='center'>
                <Text mr={2}>Your action:</Text>
                <IconButton
                  aria-label='Approved'
                  icon={<CheckIcon width={20} height={20} />}
                  variant='ghost'
                  isDisabled={true}
                  colorScheme='green'
                />
              </Flex>
            ) : (
              <>
                <IconButton
                  aria-label='Approve'
                  icon={<CheckIcon width={20} height={20} />}
                  onClick={() => handleApprove(key, value)}
                  colorScheme='green'
                  variant='outline'
                  mr={2}
                />
                <IconButton
                  aria-label='Reject'
                  icon={<CloseIcon width={20} height={20} />}
                  onClick={() => handleReject(key, value)}
                  variant='outline'
                  colorScheme='red'
                />
              </>
            )}
          </Flex>
        ),
      };
    }
  );

  return (
    <Box>
      <Text fontSize='lg'>{t('Proposed Meta Edits')}</Text>
      <Table columns={columns} rows={rows} />
    </Box>
  );
});

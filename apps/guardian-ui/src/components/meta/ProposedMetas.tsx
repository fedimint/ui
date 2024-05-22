import React, { useState, useEffect, useCallback } from 'react';
import { Flex, IconButton, Text, Box } from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from '../../assets/svgs/check.svg';
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

interface ProposedMetasProps {
  ourPeer: { id: number; name: string };
  metaModuleId: string;
  updateEditedMetaFields: (fields: MetaFields) => void;
  pollTimeout: number;
}

type TableKey = 'metaKey' | 'value';

export const ProposedMetas = React.memo(function ProposedMetas({
  ourPeer,
  metaModuleId,
  pollTimeout,
}: ProposedMetasProps): JSX.Element {
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
    async (submissions: { key: string; value: string; peers: string[] }[]) => {
      try {
        const metaFields = submissions.map(
          ({ key, value }) => [key, value] as [string, string]
        );

        const hasVoted = submissions.some((submission) =>
          submission.peers.includes(ourPeer.id.toString())
        );

        if (hasVoted) {
          // Clear the submission if already approved
          await api.moduleApiCall<{ metaValue: string }[]>(
            Number(metaModuleId),
            ModuleRpc.submitMeta,
            {
              key: DEFAULT_META_KEY,
              value: metaToHex(fieldsToMeta([])), // Empty submission
            }
          );

          console.log(`Cleared meta edits for: ${JSON.stringify(metaFields)}`);

          // Update the state to reflect the clearing
          setMetaSubmissions((prev) =>
            prev.map((submission) =>
              metaFields.some(
                ([key, value]) =>
                  submission[0] === key && submission[1] === value
              )
                ? [
                    submission[0],
                    submission[1],
                    submission[2].filter(
                      (peerId) => peerId !== ourPeer.id.toString()
                    ),
                  ]
                : submission
            )
          );
        } else {
          // Submit the meta fields for the guardian
          await api.moduleApiCall<{ metaValue: string }[]>(
            Number(metaModuleId),
            ModuleRpc.submitMeta,
            {
              key: DEFAULT_META_KEY,
              value: metaToHex(fieldsToMeta(metaFields)),
            }
          );

          console.log(
            `Approved and submitted meta edits: ${JSON.stringify(metaFields)}`
          );

          // Update the state to reflect the approval
          setMetaSubmissions((prev) =>
            prev.map((submission) =>
              metaFields.some(
                ([key, value]) =>
                  submission[0] === key && submission[1] === value
              )
                ? [
                    submission[0],
                    submission[1],
                    [...submission[2], ourPeer.id.toString()],
                  ]
                : submission
            )
          );
        }
      } catch (err) {
        console.error('Failed to submit meta edits', err);
      }
    },
    [api, metaModuleId, ourPeer.id]
  );

  const columns: TableColumn<TableKey>[] = [
    {
      key: 'metaKey',
      heading: t('set-config.meta-fields-key'),
    },
    {
      key: 'value',
      heading: t('set-config.meta-fields-value'),
    },
  ];

  const groupedSubmissions = metaSubmissions.reduce(
    (acc, [key, value, peers]) => {
      const groupKey = peers.join(',');
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push({ key, value, peers });
      return acc;
    },
    {} as { [key: string]: { key: string; value: string; peers: string[] }[] }
  );

  const renderTable = (
    submissions: { key: string; value: string; peers: string[] }[]
  ) => {
    const hasVoted = submissions.some((submission) =>
      submission.peers.includes(ourPeer.id.toString())
    );
    const rows: TableRow<TableKey>[] = submissions.map(({ key, value }) => ({
      key: `${key}-${value}`,
      metaKey: <Text>{key}</Text>,
      value: <Text>{value}</Text>,
    }));

    const peerNames = submissions[0].peers
      .map((peerId) => {
        const peer =
          ourPeer.id === Number(peerId) ? ourPeer.name : `Peer ${peerId}`;
        return peer;
      })
      .join(', ');

    return (
      <Box key={submissions[0].peers.join(',')} mb={4}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text fontSize='lg'>{peerNames}&apos;s Proposal</Text>
          <Flex>
            <IconButton
              aria-label='Approve'
              icon={<CheckIcon width={20} height={20} />}
              onClick={() => handleApprove(submissions)}
              color='green.500'
              variant={hasVoted ? 'solid' : 'outline'}
              mr={2}
              mb={2}
            />
          </Flex>
        </Flex>
        <Table columns={columns} rows={rows} />
      </Box>
    );
  };

  if (metaSubmissions.length !== 0) {
    return (
      <Flex flexDir='column' width='100%'>
        <Text fontSize='lg'>{t('Proposed Meta Edits')}</Text>
        {Object.values(groupedSubmissions).map(renderTable)}
      </Flex>
    );
  } else {
    return <></>;
  }
});

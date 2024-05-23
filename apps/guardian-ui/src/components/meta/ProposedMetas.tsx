import React, { useState, useEffect, useCallback } from 'react';
import { Flex, Text, Box, Button } from '@chakra-ui/react';
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
  peers: { id: number; name: string }[];
  metaModuleId: string;
  updateEditedMetaFields: (fields: MetaFields) => void;
  pollTimeout: number;
  onOpen: () => void;
}

type TableKey = 'metaKey' | 'value';

export const ProposedMetas = React.memo(function ProposedMetas({
  ourPeer,
  peers,
  metaModuleId,
  pollTimeout,
  onOpen,
}: ProposedMetasProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();

  const [metaSubmissions, setMetaSubmissions] = useState<MetaSubmissionFields>(
    []
  );
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const pollSubmissionInterval = setInterval(async () => {
      try {
        const submissions = await api.moduleApiCall<MetaSubmissions>(
          Number(metaModuleId),
          ModuleRpc.getSubmissions,
          0
        );

        const metaMap: MetaSubmissionMap = {};

        Object.entries(submissions).forEach(([peer, submission]) => {
          const meta = hexToMeta(submission);
          Object.entries(meta).forEach(([key, value]) => {
            if (value) {
              if (!metaMap[key]) {
                metaMap[key] = {};
              }
              if (!metaMap[key][value]) {
                metaMap[key][value] = [];
              }
              metaMap[key][value].push(peer);
            }
          });
        });

        const transformed: MetaSubmissionFields = Object.entries(
          metaMap
        ).flatMap(([k, v]) =>
          Object.entries(v).map(
            ([a, b]) => [k, a, b] as [string, string, string[]]
          )
        );

        setMetaSubmissions(transformed);

        // Update hasVoted state
        const voted = transformed.some(([, , peers]) =>
          peers.includes(ourPeer.id.toString())
        );
        setHasVoted(voted);
      } catch (err) {
        console.warn('Failed to poll for meta submissions', err);
      }
    }, pollTimeout);
    return () => {
      clearInterval(pollSubmissionInterval);
    };
  }, [api, metaModuleId, pollTimeout, ourPeer.id]);

  const handleClear = useCallback(async () => {
    try {
      // Clear the submission if already approved
      await api.moduleApiCall<{ metaValue: string }[]>(
        Number(metaModuleId),
        ModuleRpc.submitMeta,
        {
          key: DEFAULT_META_KEY,
          value: metaToHex(fieldsToMeta([])), // Empty submission
        }
      );

      console.log('Cleared meta edits');

      // Update the state to reflect the clearing
      setMetaSubmissions((prev) =>
        prev.map((submission) =>
          submission[2].includes(ourPeer.id.toString())
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
      setHasVoted(false);
    } catch (err) {
      console.error('Failed to clear meta edits', err);
    }
  }, [api, metaModuleId, ourPeer.id]);

  const handleApprove = useCallback(
    async (submissions: { key: string; value: string; peers: string[] }[]) => {
      try {
        const metaFields = submissions.map(
          ({ key, value }) => [key, value] as [string, string]
        );

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
              ([key, value]) => submission[0] === key && submission[1] === value
            )
              ? [
                  submission[0],
                  submission[1],
                  [...submission[2], ourPeer.id.toString()],
                ]
              : submission
          )
        );

        setHasVoted(true);
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
    const rows: TableRow<TableKey>[] = submissions.map(({ key, value }) => ({
      key: `${key}-${value}`,
      metaKey: <Text>{key}</Text>,
      value: <Text>{value}</Text>,
    }));

    const peerNames = submissions[0].peers
      .map((peerId) => {
        if (ourPeer.id === Number(peerId)) {
          return 'Your';
        }
        const peer = peers.find((p) => p.id === Number(peerId));
        return peer?.name;
      })
      .filter(Boolean); // Remove undefined values

    let formattedPeerNames;
    if (peerNames.length === 1) {
      formattedPeerNames = peerNames[0];
    } else if (peerNames.length === 2) {
      formattedPeerNames = `${peerNames[0]} and ${peerNames[1]}`;
    } else {
      formattedPeerNames = `${peerNames.slice(0, -1).join(', ')}, and ${
        peerNames[peerNames.length - 1]
      }`;
    }

    return (
      <Box key={submissions[0].peers.join(',')} mb={4}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text fontSize='lg'>{formattedPeerNames} Proposal</Text>
          {hasVoted ? null : (
            <Button
              onClick={() => handleApprove(submissions)}
              colorScheme='green'
              variant={'outline'}
              mr={2}
              mb={2}
            >
              {'Approve'}
            </Button>
          )}
        </Flex>
        <Table columns={columns} rows={rows} />
      </Box>
    );
  };

  return (
    <>
      <Flex flexDir='row' justifyContent='space-between' alignItems='center'>
        <Text fontSize='lg'>{t('Proposed Meta Edits')}</Text>
        {hasVoted ? (
          <Button onClick={handleClear} variant='outline' colorScheme='red'>
            {t(
              'federation-dashboard.config.manage-meta.clear-approvals-button'
            )}
          </Button>
        ) : (
          <Button onClick={onOpen} variant='solid' colorScheme='green'>
            {t(
              'federation-dashboard.config.manage-meta.propose-new-meta-button'
            )}
          </Button>
        )}
      </Flex>
      {Object.values(groupedSubmissions).map(renderTable)}
    </>
  );
});

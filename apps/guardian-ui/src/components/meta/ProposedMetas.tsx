import React, { useState, useEffect, useCallback } from 'react';
import {
  Flex,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
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
import { Table, TableColumn } from '@fedimint/ui';
import { DEFAULT_META_KEY } from './MetaManager';
import { bftHonest, generateSimpleHash } from '../../utils';

type MetaSubmissionMap = {
  [key: string]: {
    peers: number[];
    meta: MetaFields;
  };
};

interface ProposedMetasProps {
  ourPeer: { id: number; name: string };
  peers: { id: number; name: string }[];
  metaModuleId: string;
  updateEditedMetaFields: (fields: MetaFields) => void;
  pollTimeout: number;
  onOpen: () => void;
  consensusMeta: Record<string, string>;
}

type TableKey = 'metaKey' | 'value' | 'effect';

export const ProposedMetas = React.memo(function ProposedMetas({
  ourPeer,
  peers,
  metaModuleId,
  pollTimeout,
  onOpen,
  consensusMeta,
}: ProposedMetasProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const [metaSubmissions, setMetaSubmissions] = useState<MetaSubmissionMap>();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<MetaFields | null>(null);

  const totalGuardians = peers.length;
  const threshold = bftHonest(totalGuardians);

  useEffect(() => {
    const pollSubmissionInterval = setInterval(async () => {
      try {
        const submissions = await api.moduleApiCall<MetaSubmissions>(
          Number(metaModuleId),
          ModuleRpc.getSubmissions,
          0
        );

        const metas: MetaSubmissionMap = {};
        let voted = false;

        Object.entries(submissions).forEach(([peer, hexString]) => {
          if (hexString === '7b7d') return; // Filter out empty submissions
          const metaObject = hexToMeta(hexString);
          const meta = Object.entries(metaObject).filter(
            ([, value]) => value !== undefined && value !== ''
          ) as [string, string][];

          const metaKey = JSON.stringify(meta); // Use JSON string as a key to group identical metas

          if (metas[metaKey]) {
            metas[metaKey].peers.push(Number(peer));
          } else {
            metas[metaKey] = {
              peers: [Number(peer)],
              meta: meta as MetaFields,
            };
          }

          if (Number(peer) === ourPeer.id) {
            voted = true;
          }
        });

        setMetaSubmissions(metas);
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
      await api.moduleApiCall<{ metaValue: string }[]>(
        Number(metaModuleId),
        ModuleRpc.submitMeta,
        {
          key: DEFAULT_META_KEY,
          value: metaToHex(fieldsToMeta([])), // Empty submission
        }
      );
      setHasVoted(false);
    } catch (err) {
      console.error('Failed to clear meta edits', err);
    }
  }, [api, metaModuleId]);

  const handleApprove = useCallback(
    async (meta: MetaFields) => {
      try {
        // Submit the meta fields for the guardian
        await api.moduleApiCall<{ metaValue: string }[]>(
          Number(metaModuleId),
          ModuleRpc.submitMeta,
          {
            key: DEFAULT_META_KEY,
            value: metaToHex(fieldsToMeta(meta)),
          }
        );

        console.log(
          `Approved and submitted meta edits: ${JSON.stringify(meta)}`
        );

        setHasVoted(true);
      } catch (err) {
        console.error('Failed to submit meta edits', err);
      }
    },
    [api, metaModuleId]
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
    {
      key: 'effect',
      heading: t('set-config.meta-fields-effect'),
    },
  ];

  const getEffect = (key: string, value: string): JSX.Element => {
    console.log('consensusMeta', consensusMeta);
    if (consensusMeta[key] === undefined) {
      return (
        <Text color='green.500'>
          {t('federation-dashboard.config.manage-meta.meta-effect-add')}
        </Text>
      );
    } else if (String(consensusMeta[key]) !== value) {
      return (
        <Text color='yellow.500'>
          {t('federation-dashboard.config.manage-meta.meta-effect-modify')}
        </Text>
      );
    } else {
      return (
        <Text color='gray.500'>
          {t('federation-dashboard.config.manage-meta.meta-effect-unchanged')}
        </Text>
      );
    }
  };

  const handleApproveWithWarning = (
    meta: MetaFields,
    currentApprovals: number
  ) => {
    if (currentApprovals + 1 >= threshold) {
      setSelectedMeta(meta);
      openModal();
    } else {
      handleApprove(meta);
    }
  };

  const confirmApproval = async () => {
    if (selectedMeta) {
      await handleApprove(selectedMeta);
      onClose();
    }
  };

  return (
    <Flex flexDir='column' width='100%'>
      {metaSubmissions && Object.keys(metaSubmissions).length > 0 ? (
        <Flex
          flexDir='row'
          justifyContent='space-between'
          alignItems='center'
          mb={4}
        >
          <Text fontSize='lg' fontWeight='semibold'>
            {t('federation-dashboard.config.manage-meta.proposals')}
          </Text>
          <Text fontSize='md'>
            {t('common.threshold')}: {threshold} / {totalGuardians}
          </Text>
        </Flex>
      ) : null}
      {metaSubmissions &&
        Object.entries(metaSubmissions).map(([key, submission]) => {
          const submissionKeys = new Set(submission.meta.map(([key]) => key));
          const rows = [
            ...submission.meta.map(([key, value]) => ({
              key: `${key}-${value}`,
              metaKey: <Text>{key}</Text>,
              value: <Text>{value}</Text>,
              effect: getEffect(key, value),
            })),
            ...Object.entries(consensusMeta)
              .filter(([key]) => !submissionKeys.has(key))
              .map(([key, value]) => ({
                key: `${key}-${value}`,
                metaKey: <Text as='del'>{key}</Text>,
                value: <Text as='del'>{value}</Text>,
                effect: <Text color='red.500'>Remove</Text>,
              })),
          ];

          const totalGuardians = peers.length;
          const currentApprovals = submission.peers.length;

          return (
            <Card key={key} mb={4}>
              <CardHeader>
                <Flex justifyContent='space-between' alignItems='center'>
                  <Text fontSize='md' fontWeight={'semibold'}>
                    {`Proposal ID: ${generateSimpleHash(key)}`}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody mb={0}>
                <Table columns={columns} rows={rows} />
              </CardBody>
              <CardFooter flexDir='row' justifyContent='space-between'>
                <Flex alignItems='justify-left' flexDir='column' gap={2}>
                  <Text fontWeight='semibold'>
                    {t('common.approvals')}: ( {currentApprovals} /
                    {totalGuardians} )
                  </Text>
                  {submission.peers.map((peerId) => (
                    <Flex key={peerId} alignItems='center' mr={2}>
                      <Icon
                        as={CheckIcon}
                        color={
                          ourPeer.id === Number(peerId)
                            ? 'blue.500'
                            : 'green.500'
                        }
                        w={5}
                        h={5}
                      />
                      <Text ml={1}>
                        {ourPeer.id === Number(peerId)
                          ? 'You'
                          : peers.find((p) => p.id === Number(peerId))?.name}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
                {submission.peers.includes(ourPeer.id) ? (
                  <Button
                    onClick={handleClear}
                    variant='outline'
                    colorScheme='red'
                  >
                    {t('federation-dashboard.config.manage-meta.revoke-button')}
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      handleApproveWithWarning(
                        submission.meta,
                        currentApprovals
                      )
                    }
                    colorScheme='green'
                    variant={'outline'}
                    ml={4}
                  >
                    {t('common.approve')}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      {hasVoted ? null : (
        <Button onClick={onOpen} variant='solid' colorScheme='green'>
          {t('federation-dashboard.config.manage-meta.propose-new-meta-button')}
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('Approval Confirmation')}</ModalHeader>
          <ModalBody>
            <Text mb={4}>
              {t(
                'Your approval will reach the threshold to adopt this meta change. Your new meta will look like:'
              )}
            </Text>
            {selectedMeta && (
              <Table
                columns={columns}
                rows={selectedMeta.map(([key, value]) => ({
                  key: `${key}-${value}`,
                  metaKey: <Text>{key}</Text>,
                  value: <Text>{value}</Text>,
                  effect: getEffect(key, value),
                }))}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button colorScheme='green' ml={3} onClick={confirmApproval}>
              {t('Confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
});

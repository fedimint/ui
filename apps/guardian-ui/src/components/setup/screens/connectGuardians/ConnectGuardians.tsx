import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Flex,
  Button,
  FormHelperText,
  Spinner,
  TableContainer,
  Table as ChakraTable,
  Tbody,
  Tr,
  Td,
  Tag,
  Icon,
} from '@chakra-ui/react';
import { CopyInput, Table, TableRow } from '@fedimint/ui';
import { ModuleKind, ServerStatus } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { useConsensusPolling, useSetupContext } from '../../../../hooks';
import { GuardianRole } from '../../../../types';
import { getModuleParamsFromConfig } from '../../../../utils/api';
import { ReactComponent as CopyIcon } from '../../../../assets/svgs/copy.svg';
import { ReactComponent as QrIcon } from '../../../../assets/svgs/qr.svg';
import { BftInfo } from '../../../BftInfo';
import { QrModal } from '../../../QrModal';

interface Props {
  next(): void;
}

export const ConnectGuardians: React.FC<Props> = ({ next }) => {
  const { t } = useTranslation();
  const {
    state: { role, peers, numPeers, configGenParams, ourCurrentId },
  } = useSetupContext();
  const [isOpen, setIsOpen] = useState(false);

  const guardianLink = ourCurrentId !== null ? peers[ourCurrentId].api_url : '';

  // Poll for peers and configGenParams while on this page.
  useConsensusPolling();

  const isAllConnected = numPeers && numPeers == peers.length;
  const isAllAccepted =
    isAllConnected &&
    peers.filter((peer) => peer.status === ServerStatus.ReadyForConfigGen)
      .length >=
      numPeers - 1;

  // For hosts, once all peers have connected, run DKG immediately.
  useEffect(() => {
    if (role !== GuardianRole.Host || !isAllAccepted) return;
    next();
  }, [role, isAllAccepted, next]);

  const handleApprove = useCallback(() => {
    next();
  }, [next]);

  let content: React.ReactNode;
  if (!configGenParams) {
    content = <Spinner />;
  } else if (role === GuardianRole.Host) {
    content = (
      <Flex direction={['column', 'row']} gap={4} align='start'>
        <FormControl maxW={400} bg='blue.50' p={2} borderRadius='md'>
          <FormLabel>{t('connect-guardians.invite-guardians')}</FormLabel>
          <Flex direction='row' alignItems='center' gap='6px'>
            <CopyInput
              value={guardianLink}
              size='sm'
              buttonLeftIcon={<Icon as={CopyIcon} />}
            />
            <Icon
              as={QrIcon}
              cursor='pointer'
              onClick={() => setIsOpen(true)}
              bg='white'
              boxSize='40px'
              borderRadius='10%'
              border='1px solid lightgray'
              _hover={{ bg: 'gray.100' }}
            />
          </Flex>

          <FormHelperText>
            {t('connect-guardians.invite-guardians-help')}
          </FormHelperText>
        </FormControl>
        <BftInfo numPeers={numPeers} />
      </Flex>
    );
  } else {
    // TODO: Consider making this more dynamic, work with unknown modules etc.
    const rows: { label: string; value: React.ReactNode }[] = [
      {
        label: 'Federation name',
        value: configGenParams.meta?.federation_name,
      },
      {
        label: 'Network',
        value: getModuleParamsFromConfig(configGenParams, ModuleKind.Wallet)
          ?.consensus?.network,
      },
      {
        label: 'Additional Block Confirmations',
        value: getModuleParamsFromConfig(configGenParams, ModuleKind.Wallet)
          ?.consensus?.finality_delay,
      },
    ];

    // Render each meta key as its own row
    Object.keys(configGenParams.meta || {})
      .filter((key) => key !== 'federation_name')
      .forEach((key) => {
        let value: React.ReactNode = configGenParams.meta?.[key];
        if (!value) return;
        try {
          value = (
            <pre style={{ maxHeight: 200, overflow: 'auto', maxWidth: '100%' }}>
              {JSON.stringify(JSON.parse(value as string), null, 2)}
            </pre>
          );
        } catch {
          /* no-op, use value as string */
        }
        rows.push({
          label: t('connect-guardians.meta-field-key', { key }),
          value,
        });
      });

    content = (
      <Flex
        direction='column'
        gap={5}
        justify='start'
        align='start'
        width='100%'
      >
        <TableContainer width='100%'>
          <ChakraTable variant='simple'>
            <Tbody>
              {rows.map(({ label, value }) => (
                <Tr key={label}>
                  <Td fontWeight='semibold' verticalAlign='top'>
                    {label}
                  </Td>
                  <Td>{value}</Td>
                </Tr>
              ))}
            </Tbody>
          </ChakraTable>
        </TableContainer>
        <div>
          <Button onClick={handleApprove}>
            {t('connect-guardians.approve')}
          </Button>
        </div>
      </Flex>
    );
  }

  const peerTableColumns = useMemo(
    () =>
      [
        {
          key: 'name',
          heading: 'Name',
        },
        {
          key: 'status',
          heading: 'Status',
        },
      ] as const,
    []
  );

  const peerTableRows = useMemo(() => {
    let rows: TableRow<'name' | 'status'>[] = [];
    for (let i = 0; i < numPeers; i++) {
      const row = peers[i]
        ? {
            key: peers[i].cert,
            name: peers[i].name,
            status:
              peers[i].status === ServerStatus.ReadyForConfigGen ||
              ourCurrentId === i ? (
                <Tag colorScheme='green'>{t('connect-guardians.approved')}</Tag>
              ) : (
                <Tag colorScheme='orange'>{t('connect-guardians.pending')}</Tag>
              ),
          }
        : {
            key: i,
            name: t('connect-guardians.waiting-for-guardian') + ` ${i + 1}...`,
            status: (
              <Tag colorScheme='gray'>{t('connect-guardians.not-joined')}</Tag>
            ),
          };
      rows = [...rows, row];
    }
    return rows;
  }, [numPeers, ourCurrentId, peers, t]);

  return (
    <Flex
      direction='column'
      width='100%'
      justify='start'
      align='start'
      gap={[8, 4]}
    >
      {content}
      {peerTableRows.length > 1 && (
        <Table
          title={t('connect-guardians.table-title')}
          description={t('connect-guardians.table-description')}
          columns={peerTableColumns}
          rows={peerTableRows}
        />
      )}
      <QrModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={guardianLink}
        header={t('connect-guardians.invite-guardians')}
      />
    </Flex>
  );
};

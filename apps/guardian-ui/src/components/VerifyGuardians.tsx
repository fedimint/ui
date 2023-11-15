import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Flex,
  Icon,
  Heading,
  Text,
  Spinner,
  Input,
  Tag,
  useTheme,
  CircularProgress,
} from '@chakra-ui/react';
import { CopyInput, FormGroup, Table } from '@fedimint/ui';
import { useConsensusPolling, useSetupContext } from '../hooks';
import { GuardianRole, Peer } from '../types';
import { ReactComponent as ArrowRightIcon } from '../assets/svgs/arrow-right.svg';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { formatApiErrorMessage } from '../utils/api';
import { useTranslation } from '@fedimint/utils';
import { ServerStatus } from '../types';

interface PeerWithHash {
  id: string;
  peer: Peer;
  hash: string;
}

interface Props {
  next(): void;
}

export const VerifyGuardians: React.FC<Props> = ({ next }) => {
  const { t } = useTranslation();
  const {
    api,
    state: { role, numPeers, peers },
  } = useSetupContext();
  const theme = useTheme();
  const isHost = role === GuardianRole.Host;
  const [myHash, setMyHash] = useState('');
  const [peersWithHash, setPeersWithHash] = useState<PeerWithHash[]>();
  const [enteredHashes, setEnteredHashes] = useState<string[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string>();

  // Poll for peers and configGenParams while on this page.
  useConsensusPolling();

  const verifiedConfigs: boolean = peers.every(
    (peer) => peer.status === ServerStatus.VerifiedConfigs
  );

  useEffect(() => {
    async function assembleHashInfo() {
      try {
        const [
          {
            consensus: { peers },
            our_current_id,
          },
          hashes,
        ] = await Promise.all([
          api.getConsensusConfigGenParams(),
          api.getVerifyConfigHash(),
        ]);

        setMyHash(hashes[our_current_id]);
        setPeersWithHash(
          Object.entries(peers)
            .map(([id, peer]) => ({
              id,
              peer,
              hash: hashes[id as unknown as number],
            }))
            .filter((peer) => peer.id !== our_current_id.toString())
        );

        // If we're already at the VerifiedConfigs state, prefill all the other hashes with the correct values
        if (peers[our_current_id].status === ServerStatus.VerifiedConfigs) {
          const otherPeers = Object.entries(peers).filter(
            ([id]) => id !== our_current_id.toString()
          );
          setEnteredHashes(
            otherPeers.map(([id]) => hashes[id as unknown as number])
          );
        }
      } catch (err) {
        setError(formatApiErrorMessage(err));
      }
    }
    assembleHashInfo();
  }, [api]);

  useEffect(() => {
    // If we're the only guardian, skip this verify other guardians step.
    if (numPeers === 1) {
      api
        .startConsensus()
        .then(next)
        .catch((err) => {
          setError(formatApiErrorMessage(err));
        });
      return;
    }

    const isAllValid =
      peersWithHash &&
      peersWithHash.every(({ hash }, idx) => hash === enteredHashes[idx]);

    if (isAllValid) {
      !verifiedConfigs &&
        api.verifiedConfigs().catch((err) => {
          setError(formatApiErrorMessage(err));
        });
    }
  }, [api, peersWithHash, enteredHashes, verifiedConfigs, numPeers, next]);

  const handleNext = useCallback(async () => {
    setIsStarting(true);
    try {
      await api.startConsensus();
      next();
    } catch (err) {
      setError(formatApiErrorMessage(err));
    }
    setIsStarting(false);
  }, [api, next]);

  // Host of one immediately skips this step.
  useEffect(() => {
    if (isHost && !numPeers) {
      handleNext();
    }
  }, [handleNext, numPeers, isHost]);

  const tableColumns = useMemo(
    () => [
      {
        key: 'name',
        heading: t('verify-guardians.table-column-name'),
        width: '200px',
      },
      {
        key: 'status',
        heading: t('verify-guardians.table-column-status'),
        width: '160px',
      },
      {
        key: 'hashInput',
        heading: t('verify-guardians.table-column-hash-input'),
      },
    ],
    [t]
  );

  const handleChangeHash = useCallback((value: string, index: number) => {
    setEnteredHashes((hashes) => {
      const newHashes = [...hashes];
      newHashes[index] = value;
      return newHashes;
    });
  }, []);

  const tableRows = useMemo(() => {
    if (!peersWithHash) return [];
    return peersWithHash.map(({ peer, hash }, idx) => {
      const value = enteredHashes[idx] || '';
      const isValid = Boolean(value && value === hash);
      const isError = Boolean(value && !isValid);
      return {
        key: peer.cert,
        name: (
          <Text maxWidth={200} isTruncated>
            {peer.name}
          </Text>
        ),
        status: isValid ? (
          <Tag colorScheme='green'>{t('verify-guardians.verified')}</Tag>
        ) : (
          ''
        ),
        hashInput: (
          <FormControl isInvalid={isError}>
            <Input
              variant='filled'
              value={value}
              placeholder={`${t('verify-guardians.verified-placeholder')}`}
              onChange={(ev) => handleChangeHash(ev.currentTarget.value, idx)}
              readOnly={isValid}
            />
          </FormControl>
        ),
      };
    });
  }, [peersWithHash, enteredHashes, handleChangeHash, t]);

  if (error) {
    return (
      <Flex direction='column' gap={6}>
        <Heading size='sm'>{t('verify-guardians.error')}</Heading>
        <Text color={theme.colors.red[500]}>{error}</Text>
      </Flex>
    );
  } else if (!peersWithHash) {
    return <Spinner />;
  } else if (numPeers === 1) {
    return (
      <Flex direction='column' gap={10} justify='center' align='center'>
        <CircularProgress
          isIndeterminate
          color={theme.colors.blue[400]}
          size='200px'
        />
        <Heading size='sm'>{t('verify-guardians.starting-consensus')}</Heading>
      </Flex>
    );
  } else {
    return (
      <Flex direction='column' gap={10} justify='start' align='start'>
        <FormGroup>
          <FormControl bg={theme.blue[50]} p={2} borderRadius='md'>
            <FormLabel>{t('verify-guardians.verification-code')}</FormLabel>
            <CopyInput value={myHash} buttonLeftIcon={<Icon as={CopyIcon} />} />
            <FormHelperText>
              {t('verify-guardians.verification-code-help')}
            </FormHelperText>
          </FormControl>
        </FormGroup>
        <Table
          title={t('verify-guardians.table-title')}
          description={t('verify-guardians.table-description')}
          columns={tableColumns}
          rows={tableRows}
        />
        <Flex direction='row' mt={4} gap={2}>
          <Button
            isDisabled={!verifiedConfigs}
            isLoading={isStarting}
            onClick={verifiedConfigs ? handleNext : undefined}
            leftIcon={<Icon as={ArrowRightIcon} />}
          >
            {t('common.next')}
          </Button>
          <WaitingForVerification verifiedConfigs={verifiedConfigs} />
        </Flex>
      </Flex>
    );
  }
};

const WaitingForVerification: React.FC<{ verifiedConfigs: boolean }> = ({
  verifiedConfigs,
}) => {
  const { t } = useTranslation();

  return (
    <Flex direction='row' height='100%' my={'auto'}>
      {verifiedConfigs ? (
        <Text>{t('verify-guardians.all-guardians-verified')}</Text>
      ) : (
        <>
          <Spinner />
          <Text>{t('verify-guardians.wait-all-guardians-verification')}</Text>
        </>
      )}
    </Flex>
  );
};

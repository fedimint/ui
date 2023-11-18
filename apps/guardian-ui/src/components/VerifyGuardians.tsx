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
  Hide,
  Show,
  Box,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { CopyInput, Table } from '@fedimint/ui';
import { useConsensusPolling, useSetupContext } from '../hooks';
import { GuardianRole, Peer } from '../types';
import { ReactComponent as ArrowRightIcon } from '../assets/svgs/arrow-right.svg';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { formatApiErrorMessage } from '../utils/api';
import { useTranslation } from '@fedimint/utils';
import { ServerStatus } from '../types';
import { ReactComponent as CheckCircleIcon } from '../assets/svgs/check-circle.svg';
import { ReactComponent as XCircleIcon } from '../assets/svgs/x-circle.svg';

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
    state: { role, numPeers, peers, ourCurrentId },
  } = useSetupContext();
  const theme = useTheme();
  const isHost = role === GuardianRole.Host;
  const [myHash, setMyHash] = useState('');
  const [peersWithHash, setPeersWithHash] = useState<PeerWithHash[]>();
  const [enteredHashes, setEnteredHashes] = useState<string[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string>();

  const verifiedConfigs: boolean = peers.every(
    (peer) => peer.status === ServerStatus.VerifiedConfigs
  );

  // Poll for peers and configGenParams while on this page.
  useConsensusPolling(!verifiedConfigs);

  useEffect(() => {
    async function assembleHashInfo() {
      if (peers.length === 0) {
        return setError(t('verify-guardians.error'));
      }

      if (ourCurrentId === null) {
        return setError(t('verify-guardians.error-peer-id'));
      }

      try {
        const hashes = await api.getVerifyConfigHash();

        setMyHash(hashes[ourCurrentId]);
        setPeersWithHash(
          Object.entries(peers)
            .map(([id, peer]) => ({
              id,
              peer,
              hash: hashes[id as unknown as number],
            }))
            .filter((peer) => peer.id !== ourCurrentId.toString())
        );

        // If we're already at the VerifiedConfigs state, prefill all the other hashes with the correct values
        if (peers[ourCurrentId].status === ServerStatus.VerifiedConfigs) {
          const otherPeers = Object.entries(peers).filter(
            ([id]) => id !== ourCurrentId.toString()
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
  }, [api, peers, ourCurrentId, t]);

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

    if (isAllValid && !verifiedConfigs) {
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
        <FormControl bg={theme.colors.blue[50]} p={4} borderRadius='md'>
          <FormLabel>{t('verify-guardians.verification-code')}</FormLabel>
          <CopyInput
            value={myHash}
            buttonLeftIcon={<Icon as={CopyIcon} />}
            size='sm'
          />
          <FormHelperText>
            {t('verify-guardians.verification-code-help')}
          </FormHelperText>
        </FormControl>
        <Hide below='sm'>
          <Table
            title={t('verify-guardians.table-title')}
            description={t('verify-guardians.table-description')}
            columns={tableColumns}
            rows={tableRows}
          />
        </Hide>
        <Show below='sm'>
          <Flex direction='column' width='full' gap={4}>
            {peersWithHash.map(({ peer, hash }, idx) => {
              const value = enteredHashes[idx] || '';
              const isValid = value === hash;
              const isError = value && !isValid;

              return (
                <Box key={peer.cert}>
                  <Text fontWeight='bold' isTruncated>
                    {peer.name}
                  </Text>
                  <Flex direction='row' align='center' justify='start'>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                          {isValid ? (
                            <CheckCircleIcon color='green' />
                          ) : isError ? (
                            <XCircleIcon color='red' />
                          ) : null}
                        </InputLeftElement>
                        <Input
                          variant='filled'
                          value={value}
                          placeholder={`${t(
                            'verify-guardians.verified-placeholder'
                          )}`}
                          onChange={(ev) =>
                            handleChangeHash(ev.currentTarget.value, idx)
                          }
                          readOnly={isValid}
                        />
                      </InputGroup>
                    </FormControl>
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        </Show>
        <Flex direction='row' mt={4} gap={4}>
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
    <Flex direction='row' height='100%' my={'auto'} gap={4}>
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

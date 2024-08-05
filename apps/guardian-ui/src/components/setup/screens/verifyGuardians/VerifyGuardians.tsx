import React, { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  Heading,
  Text,
  Spinner,
  useTheme,
  CircularProgress,
} from '@chakra-ui/react';
import { ServerStatus, Peer } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { useConsensusPolling, useSetupContext } from '../../../../hooks';
import { GuardianRole } from '../../../../types';
import { formatApiErrorMessage } from '../../../../utils/api';
import { QrModal } from '../../qr/QrModal';
import { Scanner } from '../../qr/Scanner';
import { VerificationCodeInput } from './VerificationCodeInput';
import { VerificationButton } from './VerificationButton';
import { PeerVerificationTable } from './PeerVerificationTable';

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
    toggleConsensusPolling,
  } = useSetupContext();
  const theme = useTheme();
  const isHost = role === GuardianRole.Host;
  const [myHash, setMyHash] = useState('');
  const [peersWithHash, setPeersWithHash] = useState<PeerWithHash[]>();
  const [enteredHashes, setEnteredHashes] = useState<string[]>([]);
  const [verifiedConfigs, setVerifiedConfigs] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string>();
  const [isQrModalOpen, setQrModalOpen] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);

  // Poll for peers and configGenParams while on this page.
  useConsensusPolling();

  useEffect(() => {
    if (peers.every((peer) => peer.status === ServerStatus.VerifiedConfigs)) {
      setVerifiedConfigs(true);
    }

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
      api
        .verifiedConfigs()
        .then(() => {
          setVerifiedConfigs(true);
          toggleConsensusPolling(false);
        })
        .catch((err) => {
          setError(formatApiErrorMessage(err));
        });
    }
  }, [
    api,
    peersWithHash,
    enteredHashes,
    verifiedConfigs,
    numPeers,
    next,
    toggleConsensusPolling,
  ]);

  const handleNext = useCallback(async (): Promise<void> => {
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

  const handleChangeHash = useCallback((value: string, index: number) => {
    setEnteredHashes((hashes) => {
      const newHashes = [...hashes];
      newHashes[index] = value;
      return newHashes;
    });
  }, []);

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
        <VerificationCodeInput
          myHash={myHash}
          setQrModalOpen={setQrModalOpen}
          isScannerActive={isScannerActive}
          setIsScannerActive={setIsScannerActive}
        />
        {isScannerActive && (
          <Scanner
            scanning={true}
            onResult={(data) => {
              const [index, hash] = data.split(':');
              handleChangeHash(hash, parseInt(index, 10));
            }}
            onError={(error) => console.error(error)}
          />
        )}
        {peersWithHash && (
          <PeerVerificationTable
            peersWithHash={peersWithHash}
            enteredHashes={enteredHashes}
            handleChangeHash={handleChangeHash}
          />
        )}
        <VerificationButton
          role={role as GuardianRole}
          verifiedConfigs={verifiedConfigs}
          isStarting={isStarting}
          handleNext={handleNext}
        />
        <QrModal
          isOpen={isQrModalOpen}
          onClose={() => setQrModalOpen(false)}
          content={`${ourCurrentId}:${myHash}`}
          header={t('verify-guardians.verification-code')}
        />
      </Flex>
    );
  }
};

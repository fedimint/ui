import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Scanner } from './Scanner';
import { useSetupContext } from '../../../hooks';

interface VerifyGuardiansScannerProps {
  onScan: (data: string) => void;
  scannedGuardians: string[];
}

export const VerifyGuardiansScanner: React.FC<VerifyGuardiansScannerProps> = ({
  onScan,
  scannedGuardians,
}) => {
  const { t } = useTranslation();
  const {
    state: { peers, ourCurrentId },
  } = useSetupContext();
  const [remainingGuardians, setRemainingGuardians] = useState<string[]>([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const guardianIds = Object.keys(peers).filter(
      (id) => id !== ourCurrentId?.toString()
    );
    setRemainingGuardians(
      guardianIds.filter((id) => !scannedGuardians.includes(id))
    );
  }, [peers, ourCurrentId, scannedGuardians]);

  const handleScan = useCallback(
    (data: string) => {
      onScan(data);
      setScanning(false);
    },
    [onScan]
  );

  const handleError = useCallback(
    (error: string | React.SyntheticEvent<HTMLVideoElement, Event>) => {
      if (typeof error === 'string') {
        console.error('QR scan error:', error);
      } else {
        console.error('QR scan error:', error.type);
      }
    },
    []
  );

  return (
    <Flex direction='column' gap={4}>
      <Text>{t('verify-guardians.scan-instructions')}</Text>
      <Box width='100%' maxWidth='300px' margin='auto'>
        <Scanner
          scanning={scanning}
          onResult={handleScan}
          onError={handleError}
        />
      </Box>
      <Text>
        {t('verify-guardians.remaining-guardians', {
          count: remainingGuardians.length,
        })}
      </Text>
      <Flex direction='column' gap={2}>
        {remainingGuardians.map((id) => (
          <Text key={id}>{peers[parseInt(id)].name}</Text>
        ))}
      </Flex>
    </Flex>
  );
};

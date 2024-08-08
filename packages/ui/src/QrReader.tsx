import type QrScanner from 'qr-scanner';
import {
  areFramesComplete,
  framesToData,
  parseFramesReducer,
  progressOfFrames,
  State as FrameState,
} from 'qrloop';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Progress,
  CircularProgress,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

export type ScanResult = QrScanner.ScanResult;

interface Props {
  processing?: boolean;
  onScan(result: ScanResult): void;
}

export const QRReader: React.FC<Props> = ({ processing, onScan }) => {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const [frames, setFrames] = useState<FrameState | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleScan = useCallback(
    (result: ScanResult) => {
      try {
        const newFrames = parseFramesReducer(frames, result.data);
        if (areFramesComplete(newFrames)) {
          const frameData = framesToData(newFrames);
          const strData = frameData.toString('utf8');
          onScan({
            data: strData,
            cornerPoints: result.cornerPoints,
          });
        }
        setFrames(newFrames);
        setProgress(progressOfFrames(newFrames));
      } catch (err) {
        console.debug('QR scan error:', err);
      }
    },
    [frames, onScan]
  );

  const handleScannerSetup = useCallback(async () => {
    if (!videoEl) return;
    try {
      const onPlaying = () => {
        setIsLoading(false);
        videoEl.removeEventListener('playing', onPlaying);
      };
      videoEl.addEventListener('playing', onPlaying);

      const QrScanner = (await import('qr-scanner')).default;
      const qrScanner = new QrScanner(videoEl, (result) => handleScan(result), {
        returnDetailedScanResult: true,
        onDecodeError: () => null,
        maxScansPerSecond: 5,
      });
      try {
        await qrScanner.start();
        setPlayError(null);
      } catch (playErr) {
        console.debug('Camera access error:', playErr);
      }
      qrScannerRef.current = qrScanner;
    } catch (err) {
      console.debug('QR scanner setup error:', err);
    }
  }, [videoEl, handleScan]);

  useEffect(() => {
    handleScannerSetup();
    return () => {
      qrScannerRef.current?.destroy();
      qrScannerRef.current = null;
    };
  }, [handleScannerSetup]);

  return (
    <Box
      position='relative'
      width='100%'
      aspectRatio='1/1'
      padding={1}
      borderRadius='xl'
    >
      <Box
        as='video'
        ref={setVideoEl}
        position='absolute'
        inset={1}
        width='calc(100% - 8px)'
        height='calc(100% - 8px)'
        borderRadius='lg'
        backgroundColor='white'
        objectFit='cover'
      />
      {isLoading && (
        <Flex
          position='absolute'
          inset={1}
          alignItems='center'
          justifyContent='center'
        >
          <CircularProgress isIndeterminate size='xs' />
        </Flex>
      )}
      {playError && (
        <Alert status='error' position='absolute' bottom={4} left={4} right={4}>
          <AlertIcon />
          {playError}
        </Alert>
      )}
      {processing && (
        <Flex
          position='absolute'
          inset={1}
          alignItems='center'
          justifyContent='center'
          bg='rgba(0, 0, 0, 0.4)'
        >
          <CircularProgress isIndeterminate color='white' />
        </Flex>
      )}
      {progress !== 0 && (
        <Box position='absolute' left={4} right={4} bottom={4}>
          <Progress value={progress * 100} />
          <Text
            position='absolute'
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)'
            fontSize='xs'
            color='white'
          >
            {Math.round(progress * 100)}%
          </Text>
        </Box>
      )}
    </Box>
  );
};

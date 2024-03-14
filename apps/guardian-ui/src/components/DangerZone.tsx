import React from 'react';
import { Box, Text, Flex, theme } from '@chakra-ui/react';
import { ClientConfig } from '@fedimint/types';
import { GuardianAuthenticationCode } from './GuardianAuthenticationCode';
import { DownloadBackup } from './DownloadBackup';
import { useTranslation } from '@fedimint/utils';

interface DangerZoneProps {
  config: ClientConfig | undefined;
  ourPeer: { id: number; name: string } | undefined;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ config, ourPeer }) => {
  const { t } = useTranslation();

  return (
    <Box mt={['12px']} bg='red.50' p={2} borderRadius='md' maxW='640px'>
      <Text
        mb='6px'
        fontSize='14px'
        fontWeight='500'
        color={theme.colors.gray[700]}
      >
        {t('federation-dashboard.danger-zone.danger-zone-label')}
      </Text>
      <Flex direction='row' alignItems='center' gap='6px'>
        {config && ourPeer !== undefined && (
          <GuardianAuthenticationCode
            ourPeer={ourPeer}
            federationId={config?.meta.federation_id ?? ''}
          />
        )}
        <DownloadBackup />
      </Flex>
      <Text mt='6px' fontSize='14px' color={theme.colors.gray[500]}>
        {t('federation-dashboard.danger-zone.danger-zone-description')}
      </Text>
    </Box>
  );
};

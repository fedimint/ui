import React, { useEffect, useState } from 'react';
import { Flex, Box, Icon, Text, useTheme } from '@chakra-ui/react';
import { CopyInput } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';
import { ConfigResponse, StatusResponse } from '../types';
import { ConnectedNodes } from '../components/ConnectedNodes';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { GuardiansCard } from './GuardiansCard';
import { FederationInfoCard } from './FederationInfoCard';
import { BitcoinNodeCard } from './BitcoinNodeCard';
import { BalanceCard } from './BalanceCard';

export const FederationAdmin: React.FC = () => {
  const theme = useTheme();
  const { api } = useAdminContext();
  const [status, setStatus] = useState<StatusResponse>();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [config, setConfig] = useState<ConfigResponse>();
  const { t } = useTranslation();

  useEffect(() => {
    // TODO: poll server status
    api.status().then(setStatus).catch(console.error);
    api.inviteCode().then(setInviteCode).catch(console.error);
  }, [api]);

  useEffect(() => {
    inviteCode && api.config(inviteCode).then(setConfig).catch(console.error);
  }, [inviteCode, api]);

  return (
    <Flex gap='32px' flexDirection='row'>
      <Flex gap={6} flexDirection='column' w='100%'>
        <Box maxWidth='400px'>
          <Text
            fontSize='24px'
            fontWeight='600'
            lineHeight='32px'
            textTransform='capitalize'
          >
            {config?.client_config.meta.federation_name}
          </Text>
          <Box mt='38px'>
            <Text
              mb='6px'
              fontSize='14px'
              fontWeight='500'
              color={theme.colors.gray[700]}
            >
              {t('federation-dashboard.invite-members')}
            </Text>
            <CopyInput
              value={inviteCode}
              buttonLeftIcon={<Icon as={CopyIcon} />}
            />
            <Text
              mt='6px'
              mb='25px'
              fontSize='14px'
              color={theme.colors.gray[500]}
            >
              {t('federation-dashboard.invite-members-prompt')}
            </Text>
          </Box>
        </Box>
        <Flex gap={6} alignItems='flex-start'>
          <FederationInfoCard status={status} />
          <Flex flex={1} direction='column' gap={5}>
            <BalanceCard />
            <BitcoinNodeCard config={config} />
          </Flex>
        </Flex>
        <GuardiansCard status={status} config={config} />
        <ConnectedNodes config={config} />
      </Flex>
    </Flex>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  Stack,
  VStack,
  Text,
  Flex,
  useTheme,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { FederationCard, ConnectFederation } from './components';
import { GatewayApi } from './GatewayApi';
import { ApiProvider } from './ApiProvider';
import { GatewayInfo, Federation } from './types';
import { Wrapper } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';

export const App = React.memo(function Admin(): JSX.Element {
  const gateway = useMemo(() => new GatewayApi(), []);

  const [gatewayInfo, setGatewayInfo] = useState<GatewayInfo>({
    federations: [],
    fees: {
      base_msat: 0,
      proportional_millionths: 0,
    },
    lightning_alias: '',
    lightning_pub_key: '',
    version_hash: '',
  });
  const [showConnectFed, toggleShowConnectFed] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    gateway
      .fetchInfo()
      .then((gatewayInfo: GatewayInfo) => {
        setGatewayInfo(gatewayInfo);
        setLoading(false);
      })
      .catch(({ message, error }) => {
        console.error(error);
        setError(message);
        setLoading(false);
      });
  }, [gateway]);

  const renderConnectedFedCallback = (federation: Federation) => {
    setGatewayInfo({
      ...gatewayInfo,
      federations: [...gatewayInfo.federations, federation],
    });
    toggleShowConnectFed(!showConnectFed);
  };

  if (loading) {
    return (
      <Flex
        bgColor={theme.colors.white}
        justifyContent='center'
        alignItems='center'
        h='100vh'
      >
        <CircularProgress
          isIndeterminate={true}
          color={theme.colors.blue[600]}
          size='240px'
          thickness='8px'
          capIsRound={true}
        >
          <CircularProgressLabel
            fontSize='md'
            fontWeight='500'
            color={theme.colors.gray[600]}
            fontFamily={theme.fonts.body}
            textAlign='center'
            width='150px'
          >
            {t('admin.fetch-info-modal-text')}
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>
    );
  }

  return (
    <ApiProvider props={{ gateway }}>
      <Wrapper size='lg'>
        {error ? (
          <VStack spacing={4}>
            <Heading size='md'>{t('common.error')}</Heading>
            <Text>{error}</Text>
          </VStack>
        ) : (
          <Box>
            {gatewayInfo?.federations.length ? null : (
              <>
                <ConnectFederation
                  renderConnectedFedCallback={renderConnectedFedCallback}
                />
              </>
            )}
            <Stack spacing={6}>
              {gatewayInfo.federations.map((federation: Federation) => {
                return (
                  <FederationCard
                    key={federation.federation_id}
                    federation={federation}
                  />
                );
              })}
            </Stack>
          </Box>
        )}
      </Wrapper>
    </ApiProvider>
  );
});

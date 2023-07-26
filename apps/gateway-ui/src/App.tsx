import React, { useState, useEffect, useMemo } from 'react';
import { Box, Center, Heading, Stack, VStack, Text } from '@chakra-ui/react';
import { FederationCard, ConnectFederation } from './components';
import { GatewayApi } from './GatewayApi';
import { ApiProvider } from './ApiProvider';
import { GatewayInfo, Federation } from './types';

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

  useEffect(() => {
    gateway
      .fetchInfo()
      .then((gatewayInfo: GatewayInfo) => {
        setGatewayInfo(gatewayInfo);
      })
      .catch(({ message, error }) => {
        console.error(error);
        setError(message);
      });
  }, [gateway]);

  const renderConnectedFedCallback = (federation: Federation) => {
    setGatewayInfo({
      ...gatewayInfo,
      federations: [...gatewayInfo.federations, federation],
    });
    toggleShowConnectFed(!showConnectFed);
  };

  return (
    <ApiProvider props={{ gateway }}>
      <Center>
        {error ? (
          <VStack spacing={4}>
            <Heading size='md'>Error</Heading>
            <Text>{error}</Text>
          </VStack>
        ) : (
          <Box
            maxW='1000px'
            width='100%'
            mt={10}
            mb={10}
            mr={[2, 4, 6, 10]}
            ml={[2, 4, 6, 10]}
          >
            {gatewayInfo?.federations.length ? null : (
              <>
                <ConnectFederation
                  renderConnectedFedCallback={renderConnectedFedCallback}
                />
              </>
            )}
            <Stack spacing={6} pt={6}>
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
      </Center>
    </ApiProvider>
  );
});

import React, { useEffect, useMemo, useState } from 'react';
import { Box, VStack, Spinner, Heading, Text, Center } from '@chakra-ui/react';
import { theme, Fonts, SharedChakraProvider } from '@fedimint/ui';
import { GuardianApi } from './GuardianApi';
import { SetupContextProvider } from './SetupContext';
import { FederationSetup } from './FederationSetup';
import { formatApiErrorMessage } from './utils/api';

export const App = React.memo(function App() {
  const api = useMemo(() => new GuardianApi(), []);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    api
      .connect()
      .then(() => {
        setIsConnected(true);
      })
      .catch((err) => {
        setError(formatApiErrorMessage(err));
      });
  }, [api]);

  return (
    <React.StrictMode>
      <Fonts />
      <SharedChakraProvider theme={theme}>
        <Center>
          <Box
            maxW='960px'
            width='100%'
            mt={10}
            mb={10}
            mr={[2, 4, 6, 10]}
            ml={[2, 4, 6, 10]}
            p={5}
          >
            {isConnected ? (
              <SetupContextProvider api={api}>
                <FederationSetup />
              </SetupContextProvider>
            ) : error ? (
              <Center>
                <VStack>
                  <Heading>Something went wrong.</Heading>
                  <Text>{error}</Text>
                </VStack>
              </Center>
            ) : (
              <Center>
                <Box p={10}>
                  <Spinner size='xl' />
                </Box>
              </Center>
            )}
          </Box>
        </Center>
      </SharedChakraProvider>
    </React.StrictMode>
  );
});

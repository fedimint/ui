import React, { useEffect, useMemo, useState } from 'react';
import { Box, VStack, Spinner, Heading, Text, Center } from '@chakra-ui/react';
import { theme, Fonts, SharedChakraProvider } from '@fedimint/ui';
import { GuardianApi } from './GuardianApi';
import { SetupContextProvider } from './setup/SetupContext';
import { AdminContextProvider } from './admin/AdminContext';
import { FederationSetup } from './setup/FederationSetup';
import { formatApiErrorMessage } from './utils/api';
import { FederationAdmin } from './admin/FederationAdmin';

export const App = React.memo(function App() {
  const api = useMemo(() => new GuardianApi(), []);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>();
  const [showAdminPage, setShowAdminPage] = useState<boolean>(false);

  useEffect(() => {
    !isConnected &&
      api
        .connect()
        .then(() => {
          setIsConnected(true);
        })
        .catch((err) => {
          setError(formatApiErrorMessage(err));
        });
  }, [api, isConnected]);

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
              showAdminPage ? (
                <AdminContextProvider api={api}>
                  <FederationAdmin />
                </AdminContextProvider>
              ) : (
                <SetupContextProvider
                  api={api}
                  transitionToAdmin={() => {
                    setIsConnected(false);
                    setShowAdminPage(true);
                  }}
                >
                  <FederationSetup />
                </SetupContextProvider>
              )
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

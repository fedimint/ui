import React, { useCallback } from 'react';
import { Box, VStack, Spinner, Heading, Text, Center } from '@chakra-ui/react';
import { theme, Fonts, SharedChakraProvider } from '@fedimint/ui';
import { SetupContextProvider } from './setup/SetupContext';
import { AdminContextProvider } from './admin/AdminContext';
import { FederationSetup } from './setup/FederationSetup';
import { FederationAdmin } from './admin/FederationAdmin';
import { useAppContext } from './hooks';
import { useTranslation } from '@fedimint/utils';

export const App = React.memo(function App() {
  const { t } = useTranslation();
  const {
    appState: { experience },
    apiState: { connected: isConnected, error },
    api,
  } = useAppContext();

  const getAppContent = useCallback(() => {
    let content: React.ReactNode = (
      <Center>
        <Box p={10}>
          <Spinner size='xl' />
        </Box>
      </Center>
    );

    if (isConnected) {
      if (error) {
        content = (
          <VStack spacing={4}>
            <Heading size='md'>{t('common.error')}</Heading>
            <Text>{error}</Text>
          </VStack>
        );
      } else {
        switch (experience) {
          case 'Setup':
            content = (
              <SetupContextProvider api={api}>
                <FederationSetup />
              </SetupContextProvider>
            );
            break;
          case 'Admin':
            content = (
              <AdminContextProvider api={api}>
                <FederationAdmin />
              </AdminContextProvider>
            );
            break;
          // TODO: Add auth experience
        }
      }
    }

    return content;
  }, [experience, isConnected, error]);

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
            {getAppContent()}
          </Box>
        </Center>
      </SharedChakraProvider>
    </React.StrictMode>
  );
});

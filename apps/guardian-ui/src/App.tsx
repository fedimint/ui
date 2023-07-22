import React, { useCallback } from 'react';
import { Box, VStack, Spinner, Heading, Text, Center } from '@chakra-ui/react';
import { theme, Fonts, SharedChakraProvider } from '@fedimint/ui';
import { SetupContextProvider } from './setup/SetupContext';
import { AdminContextProvider } from './admin/AdminContext';
import { FederationSetup } from './setup/FederationSetup';
import { FederationAdmin } from './admin/FederationAdmin';
import { useAppContext } from './hooks';
import { Wrapper } from './components/Wrapper';
import { useTranslation } from '@fedimint/utils';

export const App = React.memo(function App() {
  const { t } = useTranslation();
  const { appState, appError, api } = useAppContext();

  const getAppContent = useCallback(() => {
    switch (appState) {
      case 'Loading':
        return (
          <Center p={12}>
            <Spinner size='xl' />
          </Center>
        );
      case 'Setup':
        return (
          <SetupContextProvider api={api}>
            <Wrapper>
              <FederationSetup />
            </Wrapper>
          </SetupContextProvider>
        );
      case 'Admin':
        return (
          <AdminContextProvider api={api}>
            <Wrapper>
              <FederationAdmin />
            </Wrapper>
          </AdminContextProvider>
        );
      case 'Error':
        return (
          <VStack spacing={4}>
            <Heading size='md'>{t('common.error')}</Heading>
            <Text>{appError}</Text>
          </VStack>
        );
    }
  }, [appState, appError, api]);

  return (
    <React.StrictMode>
      <Fonts />
      <SharedChakraProvider theme={theme}>
        <Center>
          <Box width='100%'>{getAppContent()}</Box>
        </Center>
      </SharedChakraProvider>
    </React.StrictMode>
  );
});

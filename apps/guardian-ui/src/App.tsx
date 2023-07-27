import React, { useMemo } from 'react';
import { Box, VStack, Spinner, Heading, Text, Center } from '@chakra-ui/react';
import { theme, Fonts, SharedChakraProvider } from '@fedimint/ui';
import { SetupContextProvider } from './setup/SetupContext';
import { AdminContextProvider } from './admin/AdminContext';
import { FederationSetup } from './setup/FederationSetup';
import { FederationAdmin } from './admin/FederationAdmin';
import { useAppContext } from './hooks';
import { Wrapper } from './components/Wrapper';
import { Login } from './components/Login';
import { useTranslation } from '@fedimint/utils';
import { Status } from './types';

export const App = React.memo(function App() {
  const { t } = useTranslation();
  const { state, api } = useAppContext();

  const content = useMemo(() => {
    if (state.appError) {
      return (
        <VStack spacing={4}>
          <Heading size='md'>{t('common.error')}</Heading>
          <Text>{state.appError}</Text>
        </VStack>
      );
    }

    if (state.needsAuth) {
      return (
        <Wrapper>
          <Login />
        </Wrapper>
      );
    }

    if (state.status === Status.Setup && state.initServerStatus) {
      return (
        <SetupContextProvider
          initServerStatus={state.initServerStatus}
          api={api}
        >
          <Wrapper>
            <FederationSetup />
          </Wrapper>
        </SetupContextProvider>
      );
    }

    if (state.status === Status.Admin) {
      return (
        <AdminContextProvider api={api}>
          <Wrapper>
            <FederationAdmin />
          </Wrapper>
        </AdminContextProvider>
      );
    }

    return (
      <Center p={12}>
        <Spinner size='xl' />
      </Center>
    );
  }, [
    state.status,
    state.initServerStatus,
    state.appError,
    state.needsAuth,
    api,
    t,
  ]);

  return (
    <React.StrictMode>
      <Fonts />
      <SharedChakraProvider theme={theme}>
        <Center>
          <Box width='100%'>{content}</Box>
        </Center>
      </SharedChakraProvider>
    </React.StrictMode>
  );
});

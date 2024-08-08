import React, { useMemo } from 'react';
import { Box, Flex, Spinner, Heading, Text, Center } from '@chakra-ui/react';
import {
  theme,
  Fonts,
  SharedChakraProvider,
  Wrapper,
  Login,
} from '@fedimint/ui';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { SetupContextProvider } from './setup/SetupContext';
import { AdminContextProvider } from './admin/AdminContext';
import { FederationSetup } from './setup/FederationSetup';
import { FederationAdmin } from './admin/FederationAdmin';
import { useAppContext } from './hooks';
import { useTranslation } from '@fedimint/utils';
import { APP_ACTION_TYPE, Status } from './types';
import { formatApiErrorMessage } from './utils/api';
import { SetupWarning } from './components/SetupWarning';

export const App = React.memo(function App() {
  const { t } = useTranslation();
  const { state, api, dispatch } = useAppContext();

  const content = useMemo(() => {
    if (state.appError) {
      return (
        <Flex
          direction='column'
          align='center'
          width='100%'
          paddingTop='10vh'
          paddingX='4'
          textAlign='center'
        >
          <Heading size='lg' marginBottom='4'>
            {t('common.error')}
          </Heading>
          <Text fontSize='md'>{state.appError}</Text>
        </Flex>
      );
    }

    if (state.needsAuth) {
      return (
        <Wrapper>
          <Login
            checkAuth={(password) => api.testPassword(password || '')}
            setAuthenticated={() =>
              dispatch({ type: APP_ACTION_TYPE.SET_NEEDS_AUTH, payload: false })
            }
            parseError={formatApiErrorMessage}
          />
        </Wrapper>
      );
    }

    if (state.status === Status.Setup && state.initServerStatus) {
      return (
        <SetupContextProvider
          initServerStatus={state.initServerStatus}
          api={api}
        >
          <Wrapper warning={SetupWarning}>
            <FederationSetup />
          </Wrapper>
        </SetupContextProvider>
      );
    }

    if (state.status === Status.Admin) {
      return (
        <AdminContextProvider api={api}>
          <Wrapper size='lg'>
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
    dispatch,
    t,
  ]);

  return (
    <React.StrictMode>
      <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
      <SharedChakraProvider theme={theme}>
        <Center>
          <Box width='100%'>{content}</Box>
        </Center>
      </SharedChakraProvider>
    </React.StrictMode>
  );
});

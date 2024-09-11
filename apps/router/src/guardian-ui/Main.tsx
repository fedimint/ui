import React, { useMemo } from 'react';
import { Box, Flex, Spinner, Heading, Text, Center } from '@chakra-ui/react';
import { Wrapper, Login } from '@fedimint/ui';
import { SetupContextProvider } from './setup/SetupContext';
import { AdminContextProvider } from './admin/AdminContext';
import { FederationSetup } from './setup/FederationSetup';
import { FederationAdmin } from './admin/FederationAdmin';
import { useAppContext } from './hooks';
import { useTranslation } from '@fedimint/utils';
import { GUARDIAN_APP_ACTION_TYPE, GuardianStatus } from './types';
import { formatApiErrorMessage } from './utils/api';
import { NotConfigured } from './components/NotConfigured';

export const Main = React.memo(function App() {
  const { t } = useTranslation();
  const { state, api, dispatch } = useAppContext();

  console.log('state', state);

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

    if (state.status === GuardianStatus.NotConfigured) {
      return (
        <Wrapper>
          <NotConfigured api={api} dispatch={dispatch} />
        </Wrapper>
      );
    }

    if (state.needsAuth) {
      return (
        <Wrapper>
          <Login
            checkAuth={(password) => api.testPassword(password || '')}
            setAuthenticated={() =>
              dispatch({
                type: GUARDIAN_APP_ACTION_TYPE.SET_NEEDS_AUTH,
                payload: false,
              })
            }
            parseError={formatApiErrorMessage}
          />
        </Wrapper>
      );
    }

    if (state.status === GuardianStatus.Setup && state.initServerStatus) {
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

    if (state.status === GuardianStatus.Admin) {
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
    state.appError,
    state.needsAuth,
    state.initServerStatus,
    api,
    dispatch,
    t,
  ]);

  return (
    <Center>
      <Box width='100%'>{content}</Box>
    </Center>
  );
});

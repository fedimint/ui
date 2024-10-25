import React, { useCallback } from 'react';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  Divider,
} from '@chakra-ui/react';
import { ConnectFederationModal, LightningCard } from './components';
import { FederationsTable } from './components/federations/FederationsTable';
import { Loading } from './components/Loading';
import { HeaderWithUnitSelector } from './components/HeaderWithUnitSelector';
import { WalletCard } from './components/walletCard/WalletCard';
import { WalletModal } from './components/walletModal/WalletModal';
import { ErrorMessage } from './components/ErrorMessage';
import { Login } from '@fedimint/ui';
import { GATEWAY_APP_ACTION_TYPE } from '../types/gateway';
import { useTranslation } from '@fedimint/utils';
import { useGatewayContext, useLoadGateway } from '../hooks';

export const Gateway = () => {
  const { t } = useTranslation();
  const { state, dispatch, api, id } = useGatewayContext();

  useLoadGateway();

  const setActiveTab = useCallback(
    (index: number) => {
      dispatch({
        type: GATEWAY_APP_ACTION_TYPE.SET_ACTIVE_TAB,
        payload: index,
      });
    },
    [dispatch]
  );

  const handleCloseConnectFed = useCallback(
    () =>
      dispatch({
        type: GATEWAY_APP_ACTION_TYPE.SET_SHOW_CONNECT_FED,
        payload: false,
      }),
    [dispatch]
  );

  if (state.needsAuth) {
    return (
      <Login
        serviceId={id}
        checkAuth={api.testPassword}
        setAuthenticated={() =>
          dispatch({
            type: GATEWAY_APP_ACTION_TYPE.SET_NEEDS_AUTH,
            payload: false,
          })
        }
        parseError={(err) => (err as Error).message}
      />
    );
  }
  if (state.gatewayError) return <ErrorMessage error={state.gatewayError} />;
  if (state.gatewayInfo === null) return <Loading />;

  return (
    <Flex direction='column' gap={4}>
      <HeaderWithUnitSelector />
      <Card flex='1' width='100%'>
        <Tabs
          variant='soft-rounded'
          colorScheme='blue'
          index={state.activeTab}
          onChange={setActiveTab}
          orientation='vertical'
          display='flex'
          height='100%'
        >
          <Flex width='100%'>
            <TabList flexDirection='column' minWidth='200px' p={4}>
              <Tab justifyContent='flex-start' mb={2}>
                {t('wallet.title')}
              </Tab>
              <Tab justifyContent='flex-start' mb={2}>
                {t('info-card.card-header')}
              </Tab>
              <Tab justifyContent='flex-start' mb={2}>
                {t('federation-card.table-title')}
              </Tab>
            </TabList>
            <Divider orientation='vertical' />
            <TabPanels flex={1} width='100%'>
              {state.balances && (
                <TabPanel>
                  <WalletCard />
                </TabPanel>
              )}
              <TabPanel>
                <LightningCard />
              </TabPanel>
              <TabPanel>
                <FederationsTable />
              </TabPanel>
            </TabPanels>
          </Flex>
        </Tabs>
      </Card>
      <ConnectFederationModal
        isOpen={state.showConnectFed}
        onClose={handleCloseConnectFed}
      />
      <WalletModal />
    </Flex>
  );
};
